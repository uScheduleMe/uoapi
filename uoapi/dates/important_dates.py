import time
import functools as ft

from bs4 import BeautifulSoup
import requests
import regex as re
import pandas as pd
from parsedatetime import Calendar

url = "https://www.uottawa.ca/important-academic-dates-and-deadlines/"

def search_tag(tag, tag_name, attribute, 
               string, matcher=(lambda x,y: re.search(x, y) is not None)):
    try:
        if re.compile(tag_name, re.I).match(tag.name):
            return (tag.has_attr(attribute)
                    and matcher(string, tag[attribute]))
    except:
        return False

main_div = lambda x: search_tag(
    x,
    "div",
    "class",
    "uottawa-M-1-1o2",
    lambda y, z: y in z
)
tag_is_term = lambda x: search_tag(
    x,
    "details",
    "class",
    "collapsible",
    lambda y, z: y in z
)
tables_div = lambda x: search_tag(
    x,
    "div",
    "class",
    "uoe--content",
    lambda y, z: y in z
)

cal = Calendar()
strformat = {1:"-%m-%d", 2:"%H:%M:%S"}
strformat[3] = strformat[1] + "T" + strformat[2]

def normalize_date(string, year, semester):
    try:
        string = string.lower()
    except Exception as e:
        return [""]
    strings = re.split(r"\s+to\s+", string, maxsplit=1)
    last_month = None
    out = []
    for string in strings:
        dttm, code = cal.parse(string)
        if code == 0 or code > 3:
            if last_month is not None:
                dttm, code = cal.parse(last_month + " " + string)
        if code <= 0 or code > 3:
            out.append("")
        else:
            out.append(time.strftime(strformat[code], dttm))
            if code in {1, 3}:
                out[-1] = str(year if "winter" in semester and dttm.tm_mon >= 8 else year + 1) + out[-1]
            last_month = time.strftime("%B", dttm)
    return out

def extract_table(table, year, semester):
    df = pd.read_html(str(table))[0]
    df.columns = [x.strip().lower() for x in df.columns]
    df["dates"] = df["dates"].apply(ft.partial(normalize_date, year=year, semester=semester))
    return df.to_dict("records")

def extract_term(term, year, semester):
    yield {
            "category": "general", 
            "dates": extract_table(term.find("table"), year, semester),
    }
    for section in term.find_all("details", recursive=False):
        yield {
            "category": section.find("summary").text,
            "dates": extract_table(section.find("table"), year, semester),
            "subcategories": [{
                "category": subsection.find("summary").text,
                "dates": extract_table(subsection.find("table"), year, semester)
            } for subsection in section.find_all("details", recursive=False)],
        }

def extract_important_dates(text):
    text = text.replace("\a0", " ")
    soup = BeautifulSoup(text, "html.parser")
    for term in soup.find(main_div).find_all(tag_is_term, recursive=False):
        summary = re.search(
            r"([a-z-]+)\s+term\s+([0-9]{4})", 
            term.find("summary").text.lower()
        )
        if summary is not None:
            sem, year = summary.groups()
            year = int(year)
            yield {
                "semester": sem,
                "year": year,
                "dates": list(extract_term(term.find(tables_div), year, sem))
            }

def scrape_dates(url=url):
    page = requests.get(url).text
    yield from extract_important_dates(page)
