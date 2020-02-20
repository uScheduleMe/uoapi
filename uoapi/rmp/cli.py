import argparse
import json
from uoapi.rmp import get_teachers_ratings_by_school
from uoapi.cli_tools import make_parser, make_cli

description = "A tool for querying rate my prof"
help = "Make sure to provide a --school (-s) flag with the school name."
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
    for out in main(args.school):
        print(json.dumps(out))

def main(school=None):
    if not school:
        return
    yield get_teachers_ratings_by_school(school)

    
    
    

if __name__ == "__main__":
    cli()
