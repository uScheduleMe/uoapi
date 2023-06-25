import logging
logging.getLogger(__name__)

import os, sys, time
import json
import argparse

import regex as re  # type: ignore

from uoapi import __version__
from uoapi.cli_tools import make_parser, make_cli
from uoapi.timetable import query_timetable as qt

help = "A tool for querying the timetables of courses in a term"
description = ("You can query course codes like `MAT 3143`, "
    + "subjects at a level like `MAT3` "
    + "(write `XXX5` for graduate courses in subject `XXX`), "
    + "and subjects like `MAT`.\n"
    + "If you're searching for a subject at a level like `PHY1`"
    + " which has many sections, and may exceed the limit,"
    + " you can search with `PHY<1300` and `PHY>1300`, which searches for"
    + " first-year physics courses with codes less than or equal to,"
    + " and greater than or equal to respectively."
    + " This splits up the search space, "
    + "allowing more results to be returned."
    + " Other such options include `PHY=1300`, which is equivalent to"
    + " `PHY1300', and `PHY?41`, which searches for physics courses"
    + " containing `41` in the course code."
)
epilog = ""

@make_parser(description=description, epilog=epilog)
def parser(default):
    default.add_argument("-a", "--available",
        action="store_true",
        default=False,
        help="display available terms; if given, all other arguments are ignored",
    )
    default.add_argument("--term", "-t",
        action="store",
        metavar="TERM",
        choices=["winter", "summer", "fall"],
        #required=True,
        help="specify which term to query (winter, summer, fall)"
    )
    default.add_argument("--year", "-y",
        action="store",
        metavar="YEAR",
        #required=True,
        type=int,
        help="specify which year to query (2019, 2020)"
    )
    default.add_argument("courses",
        action="store",
        metavar="XXX[[<>=?]?0[000]]",
        nargs="*",
        help="list of course codes to query"
    )
    default.add_argument("-s", "--saveraw",
        action="store",
        metavar="/PATH/TO/DIR/",
        required=False,
        help="if given, save raw html in this folder"
    )
    default.add_argument("-w", "--waittime",
        action="store",
        type=float,
        default=2,
        help="specify time (in seconds) to wait between requests",
    )
    default.add_argument("-f", "--refresh",
        action="store",
        type=int,
        default=10,
        help="refresh connection after this number of queries",
    )
    default.add_argument("-r", "--retries",
        action="store",
        type=int,
        default=2,
        help="how many times to try and connect to the server",
    )
    return default

def get_subj_code(arg):
    arg = arg.strip().upper()
    match = re.search(r"([A-Z]{3,4})([<>=?][0-9]{4,5})", arg)
    if match is not None:
        return [match.groups()]
    match = re.search(r"([A-Z]{3,4})([0-9]{4,5})", arg)
    if match is not None:
        return [match.groups()]
    match = re.search(r"([A-Z]{3,4})([12345]{1})", arg)
    if match is not None:
        return [match.groups()]
    match = re.search(r"[A-Z]{3,4}", arg)
    if match is not None:
        return [(match.group(), i) for i in range(1, 6)]
    return []

@make_cli(parser)
def cli(args=None):
    if args is None:
        print("Did not receive any arguments", file=sys.stderr)
        sys.exit(1)
    if args.available:
        print(json.dumps(available(args.retries)))
    elif args.year is None:
        print("Did not receive a year", file=sys.stderr)
        sys.exit(1)
    elif args.term is None:
        print("Did not receive a term", file=sys.stderr)
        sys.exit(1)
    elif len(args.courses) == 0:
        print("Did not receive any queries", file=sys.stderr)
        sys.exit(1)
    else:
        args.waittime = max(0, args.waittime)
        for out in main(
            args.courses, args.year, args.term,
            args.saveraw, args.refresh, args.retries, args.waittime,
        ):
            print(json.dumps(out))

def available(retries=2):
    try:
        tq = qt.TimetableQuery(retries=retries)
        with tq as gm:
            out = {"available": [
                available_terms
                # Map the function which parses uOttawa term codes
                # across the sequence of codes (the keys in `tq.available`).
                for available_terms in map(qt.parse_available, tq.available.keys())
                # Filter out the codes which failed to parse.
                if available_terms is not None
            ]}
        out["messages"] = gm
        return out
    except Exception as e:
        return {
            "available": [],
            "messages": [{
                "type": "error",
                "message": "Unknown failure: {} = {}".format(type(e), e),
            }],
        }

def main(courses, year, term, saveraw=None, refresh=5, retries=2, waittime=2):
    if saveraw is not None and os.path.isdir(saveraw):
        saveraw = os.path.join(saveraw, __version__, str(year), str(term))
        os.makedirs(
            saveraw,
            mode=0o770,
            exist_ok=True,
        )
    tq = qt.TimetableQuery(log=True, retries=retries, refresh=refresh, saveraw=saveraw)
    with tq as gm:
        for i, course in enumerate(courses):
            for subj, code in get_subj_code(course):
                try:
                    resp, msgs = tq(year, term, subj, code)
                except Exception as e:
                    logging.debug("Failed to query {} {}, {}{}: {}".format(
                        term, year, subj, code, repr(e)
                    ), exc_info=True)
                    logging.error("Failed to query {} {}, {}{}: {}".format(
                        term, year, subj, code, repr(e)
                    ))
                    resp = ""
                    msgs = [{
                        "type": "error",
                        "message": "Query failure",
                    }]
                if "" == resp:
                    out = []
                    logging.warning("No data for {} {}, {}{}".format(term, year, subj, code))
                    #@TODO Handle different failure modes
                else:
                    logging.info("Got data for {} {}, {}{}".format(term, year, subj, code))
                    try:
                        out = list(qt.extract_timetable(resp, year, term, log=True))
                    except Exception as e:
                        logging.debug("Failed to parse {} {}, {}{}: {}".format(
                            term, year, subj, code, repr(e)
                        ), exc_info=True)
                        logging.error("Failed to parse {} {}, {}{}: {}".format(
                            term, year, subj, code, repr(e)
                        ))
                        out = []
                        msgs += {
                            "type": "error",
                            "message": "Parser failure",
                        }
                    else:
                        logging.info("Parsed data for {} {}, {}{}".format(term, year, subj, code))
                yield {
                    "timetables": out,
                    "messages": msgs,
                }
            time.sleep(waittime)
    yield {
        "messages": gm
    }

if __name__ == "__main__":
    cli()
