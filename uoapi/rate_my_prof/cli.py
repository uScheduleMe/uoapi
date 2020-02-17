import argparse
import json
from uoapi.rate_my_prof import getTeachersAndRatingBySchool
from uoapi.cli_tools import make_parser, make_cli

description = "A tool for querying rate my prof"
help = ""
epilog = ""

@make_parser(description=description, epilog=epilog)
def parser(default):
    default.add_argument("-s", "--school",
        action="store",
        required=True,
        help="query by school name to get all ratings for this school",
    )
    return default

@make_cli(parser)
def cli(args=None):
    if args is None:
        print("Did not receive any arguments", file=sys.stderr)
        sys.exit(1)
    print(json.dumps(main(args.school)))

def main(school=None):
    if not school:
        return
    return getTeachersAndRatingBySchool(school)

    
    
    

if __name__ == "__main__":
    cli()
