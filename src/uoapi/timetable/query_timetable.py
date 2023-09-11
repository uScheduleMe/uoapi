#!/usr/bin/python3

import os, time
import json
import itertools as it
from functools import wraps
import argparse
import logging
from typing import Union, Tuple, Optional, Callable, List

import requests
from bs4 import BeautifulSoup
import regex as re

import uoapi.course.patterns as pt


logging.getLogger(__name__)

def absolute_path(path):
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), path)


##############################################################################
# TIMETABLE QUERYING
##############################################################################

# Defaults

orig_link = (
     'https://uocampus.public.uottawa.ca/'
    +'psc/csprpr9pub/EMPLOYEE/HRMS/c/'
    +'UO_SR_AA_MODS.UO_PUB_CLSSRCH.GBL'
)
term_to_num = (
    ("fall", "9"),
    ("summer", "5"),
    ("winter","1"),
    ("9", "9"),
    ("5", "5"),
    ("1", "1"),
)
num_to_term = dict((
    ("9", "fall"),
    ("5", "summer"),
    ("1", "winter"),
))
default_headers = (('Content-Type', "application/x-www-form-urlencoded"),)

# Utilities

class ErrorMessenger:

    def __init__(
        self, 
        msg_list: Optional[list] = None, 
        prefix: str = "",
        log: bool = False, 
        raise_: Optional[Exception]=None,
    ):
        if msg_list is None:
            msg_list = []
        self.msg_list = msg_list
        self.prefix = prefix
        if log and not isinstance(log, Callable):
            log = logging.log
        self.log = log
        self.raise_ = raise_

    def __call__(self, err_type: str, message: str, **kwargs):
        if len(self.prefix) > 0:
            message = "{}: {}".format(self.prefix, message)
        self.msg_list.append({
            "type": err_type,
            "message": message,
            **kwargs
        })
        if err_type == "success":
            err_type = "info"
        err_type = err_type.strip().upper()
        err_no = getattr(logging, err_type, 10)
        if self.log:
            if len(kwargs) > 0:
                self.log(logging.DEBUG, message, **kwargs)
            self.log(err_no, message)
        if self.raise_:
            raise self.raise_((err_type, message), kwargs)

def make_request(
    method: Callable,
    messager: Callable,
    method_args: list,
    method_kwargs: dict,
    retries: int = 2,
    sleeptime: Union[int, float] = 0.5,
) -> Tuple[bool, Optional[requests.models.Response]]:
    r = None
    for _ in range(retries):
        r = method(*method_args, **method_kwargs)
        if 200 == r.status_code:
            messager("success", "%s success" % r.request.method)
            return True, r
        messager("error", "%s error: %i" % (r.request.method, r.status_code))
        time.sleep(sleeptime)
    return False, r

def require_context(method):
    @wraps(method)
    def new_method(self, *args, **kwargs):
        if self.in_context:
            return method(self, *args, **kwargs)
        raise Exception("This method can only be called while using its object in a context")
    return new_method

# Main query class

class TimetableQuery:

    def __init__(self, 
        form: Union[str, dict] = absolute_path(
            os.path.join("data", "template_query.json")
        ), # if str, either file path or JSON
        orig_link: Union[str, bytes] = orig_link, 
        term_to_num: dict = term_to_num,
        default_headers: dict = default_headers,
        retries: int = 2,
        refresh: int = 5,
        sleeptime: Union[int, float] = 1,
        log: bool = False,
        saveraw: Optional[Union[str, bytes]] = None,
    ):
        if isinstance(form, dict):
            form = dict(form)
        elif os.path.isfile(form):
            with open(form, "r") as f:
                form = json.load(f)
        else:
            form = json.loads(form)
        self.form = form
        self.orig_link = orig_link
        self.term_to_num = dict(term_to_num)
        self.default_headers = dict(default_headers)
        self.retries = retries
        self.refresh_after = refresh
        self.sleeptime = sleeptime
        self.log = log
        self.saveraw = saveraw
        self.__exit__(*[None]*3)

    # Setup methods

    def __enter__(self):
        if self.session is not None:
            raise Exception("Cannot enter this context manager if already successfully entered")
        self.session = requests.Session()
        self.messages = messages = []
        self.in_context = True
        if not self.refresh():
            self.__exit__(*[None]*3)
        return messages

    def __exit__(self, excp, value, traceback):
        if getattr(self, "session", None) is not None:
            self.session.close()
        self.session = self.messages = None
        self.available = {}
        self.in_context = False
        self.refresh_count = -1

    @require_context
    def refresh(self):
        em = ErrorMessenger(self.messages, log=self.log)
        success, response = make_request(
            self.session.get,
            em,
            [self.orig_link,],
            {"allow_redirects": True,},
            self.retries,
            self.sleeptime,
        )
        if not success:
            return False
        form_updates = self.get_hidden_inputs(response.text)
        if form_updates is None:
            em("error", "GET page has unknown format")
            return False
        icsid_updated = self.update_form(form_updates)
        if "ICSID" not in self.form or not icsid_updated:
            em("error", "ICSID not found")
            return False
        if "ICStateNum" not in self.form:
            em("warning", "Added custom ICStateNum")
            self.form["ICStateNum"] = "1"
        self.available = self.find_available(response.text)
        if len(self.available) == 0:
            em("warning", "Found no available terms to search")
        #@TODO Randomize user-agent?
        self.refresh_count = 0
        return True

    @staticmethod
    def get_hidden_inputs(text: Union[str, bytes]) -> Optional[dict]:
        # Check if page is as expected
        msg = BeautifulSoup(text, "lxml").find(lambda x: search_tag(
            x, "div", "id", "win0divDERIVED_CLSRCH_SSR_CLASS_LBLlbl"
        ))
        if msg is None or msg.contents[0].contents[0].strip().lower() == "search results":
            return None
        # If it is, return updates
        return BeautifulSoup(
            text, 
            'html.parser'
        ).find_all("input", type="hidden")

    def update_form(self, new_form: dict) -> dict:
        new_form = {x["id"]:x["value"] for x in new_form}
        self.form.update({
            x:y 
            for x, y in new_form.items() 
            if y.strip() != ''
        })
        self.form['ICAction'] = 'CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH'
        self.form["SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$0"] = "N"
        self.form["SSR_CLSRCH_WRK_SSR_OPEN_ONLY$0"] = "N"
        return "ICSID" in new_form

    @staticmethod
    def find_available(response: Union[str, bytes]) -> dict:
        options = BeautifulSoup(
            response, "lxml"
        ).find_all(lambda x: search_tag(
            x, "select", "id", r"CLASS_SRCH_WRK2_STRM\$35\$"
        ))
        if len(options) == 0:
            return {}
        options = options[0].find_all("option")
        return {tag["value"].strip():tag.text
            for tag in options 
            if re.search("[0-9]{4}", tag.get("value", "").strip()) is not None
        }

    # Calling methods

    def normalize_args(self,
        em: ErrorMessenger,
        year: Union[int, str, bytes],
        term: Union[int, str, bytes],
        subject: Union[str, bytes],
        number: Union[int, str, bytes],
    ) -> tuple:
        year = str(year).strip()
        if re.search(r"[0-9]{4}", year) is None:
            raise ValueError("Year not valid")
        term = str(term).strip().lower()
        try:
            semester = self.term_to_num[term]
        except KeyError as e:
            raise ValueError("Term not valid") from e
        semester = "2" + year[-2:] + semester
        if semester not in self.available:
            em("warning", "Semester may not be available: {}".format(term))
        subject = str(subject).strip().upper()
        number = str(number).strip().upper() 
        if pt.code_re.search((subject + number).upper()) is not None:
            search = "course"
        elif re.search("[A-Z]{3}", subject) and number in "12345":
            search = "subject:year"
        elif re.search("[A-Z]{3}", subject) and re.search("[<>=?][0-9]{4,5}", number):
            search = "subject:year:comp"
        #@TODO Add more search formats
        #elif ...:
        #    pass
        else:
            raise ValueError("Subject and number not a valid query")
        return semester, search, subject, number

    def format_form(self,
        em: ErrorMessenger,
        year: Union[int, str, bytes],
        term: Union[int, str, bytes],
        subject: Union[str, bytes],
        number: Union[int, str, bytes],
    ) -> dict:
        # Format inputs
        semester, search, subject, number = self.normalize_args(em,
            year, term, subject, number
        )
        # Clearing form
        for i in set("12345"):
            self.form[
                "UO_PUB_SRCH_WRK_SSR_RPTCK_OPT_0{}$chk$0".format(i)
            ] = "N"
            self.form.pop(
                "UO_PUB_SRCH_WRK_SSR_RPTCK_OPT_0{}$0".format(i),
                True,
            )
        self.form.pop("UO_PUB_SRCH_WRK_GRADUATED_TBL_CD$chk$0", True)
        self.form.pop("UO_PUB_SRCH_WRK_GRADUATED_TBL_CD$0", True)
        self.form.pop("SSR_CLSRCH_WRK_CATALOG_NBR$0", True)
        self.form["SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$0"] = "E"
        # Update form and return
        self.form["CLASS_SRCH_WRK2_STRM$35$"] = semester
        self.form["SSR_CLSRCH_WRK_SUBJECT$0"] = subject
        if "subject:year:comp" == search:
            comp, number = number[0], number[1:]
            self.form["SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$0"] = {
                "<": "T", # less than or equal to `number`
                ">": "G", # greature than or equal to `number`
                "?": "C", # contains `number`
                "=": "E", # is equal to `number`
            }[comp]
            self.form["SSR_CLSRCH_WRK_CATALOG_NBR$0"] = number
            number = number[0]
            if comp == "?":
                search = "" # Prevent the fall-through restricting the year/level
            # Otherwise, fall through and restrict to the year given by
            # the first digit of `number`.
            elif int(number) >= 5:
                number = "5"
        if "course" == search:
            self.form["SSR_CLSRCH_WRK_CATALOG_NBR$0"] = number
        elif "subject:year" in search:
            if "5" == number:
                self.form["UO_PUB_SRCH_WRK_GRADUATED_TBL_CD$chk$0"] = "Y"
                self.form["UO_PUB_SRCH_WRK_GRADUATED_TBL_CD$0"] = "Y"
            else:
                self.form[
                    "UO_PUB_SRCH_WRK_SSR_RPTCK_OPT_0{}$chk$0".format(number)
                ] = "Y"
                self.form[
                    "UO_PUB_SRCH_WRK_SSR_RPTCK_OPT_0{}$0".format(number)
                ] = "Y"
        #@TODO Add more search formats
        #elif ...:
        #    pass
        return self.form

    def check_response(self, response: Union[str, bytes], em: ErrorMessenger, label=""):
        if self.saveraw is not None and os.path.isdir(self.saveraw) and len(label) > 0:
            try:
                with open(os.path.join(self.saveraw,
                    str.lower("{}.html".format(label))
                ), "w", encoding="utf-8") as f:
                    f.write(response)
            except Exception as e:
                em("warning", "Saving html failed", exc_info=True)
        response = BeautifulSoup(response, "lxml")
        # Failure modes
        msg = response.find(lambda x: search_tag(
            x, "span", "id", "DERIVED_CLSMSG_ERROR_TEXT"
        ))
        # In some cases, this object is a field instead of a span
        if msg is None:
            msg = response.find(lambda x: search_tag(
                x, "field", "id", "DERIVED_CLSMSG_ERROR_TEXT"
            ))
        if msg is not None:
            msg = msg.contents[0].strip().lower()
            if "no classes found" in msg:
                em("warning", "No classes found")
                return False
            elif any(x in msg for x in "exceed maximum limit".split()):
                em("error", "Exceeded maximum number of sections")
                return False
        #@TODO Add failure modes
        # Expected
        msg = response.find(lambda x: search_tag(
            x, "div", "id", "win0divDERIVED_CLSRCH_SSR_CLASS_LBLlbl"
        ))
        if msg is not None and msg.contents[0].contents[0].strip().lower() == "search results":
            em("success", "Got search results")
            return True
        # Fall-through case
        em("error", "Unknown error in query response")
        return False

    def __call__(self,
        *args, **kwargs
    ) -> Tuple[Union[str, bytes], List[dict]]:
        label = "_".join(
            ["{}".format(x) for x in args]
            +["{}-{}".format(k, v) for k, v in kwargs.items()]
        )
        em = ErrorMessenger(log=self.log, prefix=label)
        if self.refresh_count >= self.refresh_after > 0:
            if not self.refresh():
                self.__exit__(*[None]*3)
                # In this case, `self.in_context` will be `False`,
                # so exit will be handled by clause below.
        if not self.in_context:
            em("error", "Could not connect to school server")
            return "", em.msg_list
        # We raise exceptions in format_form instead of using
        # the ErrorMessenger since we want to short-circuit
        # this method if it fails (`success = False`).
        try:
            self.format_form(em, *args, **kwargs)
        except Exception as e:
            em("error", 
                e.args[0] if len(e.args) > 0 
                else "Unknown {} in format_form".format(type(e)),
                exc_info=True
            )
            success = False
        else:
            for i in range(self.retries):
                self.refresh_count += 1
                success, response = make_request(
                    self.session.post,
                    em,
                    [self.orig_link,],
                    {
                        "data": self.form,
                        "headers": self.default_headers,
                        "allow_redirects": True,
                    },
                    self.retries,
                    self.sleeptime,
                )
                # If `success` is False, don't check response
                success = success and self.check_response(response.text, em, label)
                if (success
                    or len(em.msg_list) == 0
                    or "Unknown error in query response" not in em.msg_list[-1]["message"]
                ):
                    logging.debug("; ".join(x["message"] for x in em.msg_list))
                    break
                else:
                    logging.warning(label + ": " + "unknown error, possible stale connection, retrying...")
                    self.refresh()
        if success:
            return response.text, em.msg_list
        return "", em.msg_list


##############################################################################
# TIMETABLE SCRAPING
##############################################################################

# Utilities

def lget(seq, ind, default=None):
    if -len(seq) <= ind <= len(seq):
        return seq[ind]
    return default

def group_by_eq(seq, equalizer):
    equiv_classes = {}
    for elt in seq:
        eq = equalizer(elt)
        if eq not in equiv_classes:
            equiv_classes[eq] = []
        equiv_classes[eq].append(elt)
    return equiv_classes

def search_tag(tag, tag_name, attribute, 
               string, matcher=(lambda x,y: re.search(x, y) is not None)):
    try:
        if re.compile(tag_name, re.I).match(tag.name):
            return (tag.has_attr(attribute)
                    and matcher(string, tag[attribute]))
    except:
        return False

tag_is_course = lambda x: search_tag(
                    x, 
                    "div", 
                    "id", 
                    "win0divSSR_CLSRSLT_WRK_GROUPBOX2$", 
                    lambda x,y: y.startswith(x)
                )
course_tag_is_title = lambda x: search_tag(
                        x, 
                        "div", 
                        "id", 
                        "win0divSSR_CLSRSLT_WRK_GROUPBOX2GP",
                        lambda x,y: y.startswith(x)
                      )
course_tag_is_section = lambda x: search_tag(
                            x, 
                            "div", 
                            "id", 
                            "win0divSSR_CLSRSLT_WRK_GROUPBOX",
                            lambda x, y: y.startswith(x)
                        )
section_tag_is_classname = lambda x: search_tag(
                                x, 
                                "a", 
                                "id", 
                                "MTG_CLASSNAME"
                           )

def normalize_whitespace(string):
    string = string.replace('\xa0', ' ')
    string = string.replace('&nbsp;', ' ')
    return string.strip()

# Scraping

def _fail_value(fail, message):
    if fail:
        raise ValueError(message)

def parse_available(s):
    s = s.strip().lower()
    _fail_value(len(s) != 4, "The term code should be 4 digits long")
    s = s[1:]
    try:
        year = "20" + s[:2]
        _fail_value(len(year) != 4, "The year should have 4 digits")
        return {
            "year": int(year),
            "term": num_to_term[s[2:]],
        }
    except Exception:
        return None

def extract_section(section, descr, log=False, err_msg_prefix=""):
    em = ErrorMessenger(log=log, prefix=err_msg_prefix)
    section_name = section(section_tag_is_classname)[0].contents
    sec_id, sec_type = section_name[0].strip().upper(), section_name[-1].strip()
    id_, type_ = re.search("\s*([A-Z]*)\s*[0-9]*-\s*([A-Z]+)\s*", sec_id).groups()
    status = section(lambda x: 
        search_tag(
            x, "div", "id", "win0divDERIVED_CLSRCH_SSR_STATUS_LONG"
        )
    )
    if len(status) > 0 and len(status[0]("img")) > 0:
        status = status[0]("img")[0].attrs.get("alt", "").strip().upper()
    else:
        status = ""
    # Extract elements common to the section
    section_out = {
        "label": sec_id.strip().upper(),
        "section_id": id_.strip().upper(),
        "type": type_.strip().upper(),
        "session_type": sec_type.strip().strip(".").strip().upper(),
        "status": status.strip().upper(),
        "description": normalize_whitespace(descr),
    }
    # Extract individual components
    # rooms = [x.strip() for x in section(lambda x:  
    #         search_tag(x, "span", "id", "MTG_ROOM"))[0].contents 
    #     if isinstance(x, str)
    # ]
    instrs = [x.strip() for x in section(lambda x:  
            search_tag(x, "span", "id", "MTG_INSTR"))[0].contents 
        if isinstance(x, str)
    ]
    topic = [x.strip() for x in section(lambda x:  
            search_tag(x, "span", "id", "MTG_TOPIC"))[0].contents 
        if isinstance(x, str)
    ]
    date_re = re.compile(r"[0-9]{4}(?:\s*-\s*[0-9]{2}){2}")
    for i, s in enumerate(topic):
        s = [re.sub(r"\s*", "", x) for x in date_re.findall(s)]
        if len(s) != 2:
            em(
                "debug" if len(s) < 2 else "info",
                "Incorrect number of dates ({})".format(len(s))
                +" found in string {}".format(i),
            )
        s += [""] * max(0, 2 - len(s))
        topic[i] = s
    dttms = [x.strip().split(" ", 1) for x in section(lambda x:  
            search_tag(x, "span", "id", "MTG_DAYTIME"))[0].contents 
        if isinstance(x, str)
    ]
    # Handle the case when the number of details differ between columns
    #@TODO Move to own function
    n = max(map(len, (instrs, topic, dttms)))
    if min(map(len, (instrs, topic, dttms))) < n:
        em("debug", "inconsistent details length in %s" % id_)
    # Handle multiple instructors
    if (len(instrs) / len(dttms)) % 1 != 0:
        em(
            "debug", 
            "number of instructors not a multiple of number of days: "
            +"id %s, instructors %i, days %i" % (sec_id, len(instrs), len(dttms))
        )
        instrs = [", ".join(sorted(set(instrs)))]
    if len(instrs) > len(dttms):
        d = len(dttms)
        q = len(instrs) // d
        instrs = [", ".join(instrs[d*i:d*(i+1)]) for i in range(q)]
    elif len(instrs) < len(dttms):
        instrs = [", ".join(sorted(set(instrs)))] * len(dttms)
        em(
            "debug",
            "distributing instructors accross days"
        )
    n = max(map(len, (instrs, topic, dttms)))
    #
    return [{
        "room": "",
        "instructor": normalize_whitespace(instrs[i])
            if i < len(instrs) else "",
        "day": dttms[i][0].strip().upper()
            if i < len(dttms) else "",
        "start_time": dttms[i][-1].strip().split("-")[0].strip()
            if i < len(dttms) else "",
        "end_time": dttms[i][-1].strip().split("-")[-1].strip()
            if i < len(dttms) else "",
        "start_date": topic[i][0]
            if i < len(topic) else "",
        "end_date": topic[i][1]
            if i < len(topic) else "",
        **section_out
    } for i in range(n)], em.msg_list

def extract_course(course, year, term, log=False):
    title = course(course_tag_is_title)[0].text
    subject_code, course_code = pt.code_re.search(
        title,
    ).group().split()
    title = pt.code_re.sub("", title).strip().strip("-").strip()
    course_out = {
        "subject_code": subject_code.strip().upper(),
        "course_code": course_code.strip().upper(),
        "course_name": normalize_whitespace(title),
        "sections": [],
        "messages": [],
    }
    for section in course(course_tag_is_section):
        subsection = section.find(lambda x: search_tag(
            x,
            "tr",
            "id",
            "trSSR_CLSRCH_MTG",
        ))
        if subsection is None:
            continue
        descr = section.find(lambda x:
            search_tag(
                x, "div", "id", "win0divDERIVED_CLSRCH_DESCRLONG"
            )
        )
        sections, messages = extract_section(
            section,
            descr.text.strip() if descr is not None else "",
            log,
            "{} {}, {subject_code}{course_code}".format(term, year, **course_out),
        )
        course_out["sections"] += sections
        course_out["messages"] += messages
    course_out["sections"] = group_by_eq(
        course_out["sections"],
        lambda x: x["section_id"] 
    )
    course_out["sections"] = [{
        "year": year,
        "term": term.strip().lower(),
        "label": id_.strip().upper(),
        "components": components
    } for id_, components in course_out["sections"].items()]
    return course_out

def distribute_shared_sections(
    sections: List[dict],
    messages: List[dict],
    log: bool = False,
    err_msg_prefix: str = "",
    ):
    em = ErrorMessenger(messages, log=log, prefix=err_msg_prefix)
    sec_comps = {}
    for section in sections:
        sec_comps[section["label"]] = []
        for component in section["components"]:
            if component["type"] not in sec_comps[section["label"]]:
                sec_comps[section["label"]].append(component["type"])
    # Get sections with x distinct IDs for each x.
    arr_lookup = lambda elt: len(sec_comps[elt["label"]])
    comp_secs = group_by_eq(sections, arr_lookup)
    # If there are no sections with only one ID,
    # this course is already well distributed.
    if 1 not in comp_secs:
        return sections
    # Distribute components
    sections_out = []
    bad_sec_ids = set()
    for section in sections:
        if section["label"] in bad_sec_ids:
            continue
        for bad_section in comp_secs[1]:
            #@TODO Decide between these two filters
            #if sec_comps[bad_section["id"]][0] == "LEC":
            #    continue
            if sec_comps[bad_section["label"]][0] in sec_comps[section["label"]]:
                continue
            #
            if (arr_lookup(section) == 1
            and sec_comps[bad_section["label"]][0]
                == sec_comps[section["label"]][0]
            ):
                continue
            section["components"] = section["components"] + bad_section["components"]
            bad_sec_ids.add(bad_section["label"])
            em(
                "debug",
                "Merged sections %s and %s"
                    % (section["label"], bad_section["label"])
            )
        sections_out.append(section)
    return sections_out


def extract_timetable(text, year, term, log=False):
    soup = BeautifulSoup(text, "lxml")
    for course in soup(tag_is_course):
        course = extract_course(course, year, term, log)
        course["sections"] = distribute_shared_sections(
            course["sections"],
            course["messages"],
            log,
            "{} {}, {subject_code}{course_code}".format(term, year, **course),
        )
        yield course





