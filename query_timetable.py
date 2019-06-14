#!/usr/bin/python3
import json
import argparse
from scraping_utils import format_query, run_query, extract_timetables

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="query uOttawa timetable")
    parser.add_argument("--term", "-t",
                        action="store",
                        metavar="TERM",
                        help="specify which term to query (winter, summer, fall)")
    parser.add_argument("--year", "-y",
                        action="store",
                        metavar="YEAR",
                        help="specify which year to query (2019, 2020)")
    parser.add_argument("courses", 
                        action="store",
                        metavar="XXX 0000",
                        nargs="+",
                        help="list of course codes to query")
    args = parser.parse_args()
    courses = [(args.courses[2*i], int(args.courses[2*i+1])) 
                for i in range(len(args.courses)//2)]
    if args.term is None or args.year is None:
        raise ValueError("no values provided for term or year")
    args.year = int(args.year)
    out = {"courses": []}
    for subj, num in courses:
        query = format_query(args.year, args.term, subj, num)
        out["courses"] += extract_timetables(run_query(query), args.year, args.term)["courses"]
    print(json.dumps(out))




