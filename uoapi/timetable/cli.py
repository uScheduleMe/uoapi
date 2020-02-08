import sys, time
import json
import argparse

import regex as re

from uoapi.cli_tools import make_parser, make_cli
from uoapi.timetable import query_timetable as qt

description = "A tool for querying the timetables of courses in a term"
help = ("You can query course codes like `MAT 3143`, "
    + "subjects at a level like `MAT3` "
    + "(write `XXX5` for graduate courses in subject `XXX`), "
    + "and subjects like `MAT`."
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
        metavar="XXX[0[000]]",
        nargs="*",
        help="list of course codes to query"
    )
    default.add_argument("-w", "--waittime",
        action="store",
        type=float,
        default=0.5,
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
    tq = qt.TimetableQuery(retries=args.retries)
    if args.available:
        with tq as gm:
            print(json.dumps({"available": list(tq.available.values())}))
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
        with tq as gm:
            for i, arg in enumerate(args.courses):
                if i > 0 and args.refresh > 0 and i % args.retries == 0:
                    tq.refresh()
                for subj, code in get_subj_code(arg):
                    resp, msgs = tq(args.year, args.term, subj, code)
                    if resp == "":
                        print(json.dumps({"messages": msgs}))
                    else:
                        print(json.dumps({
                            "courses": list(qt.extract_timetable(resp, args.year, args.term)),
                            "messages": msgs,
                        }))
                time.sleep(args.waittime)
            

if __name__ == "__main__":
    cli()
