import json
import argparse

from uoapi.cli_tools import make_parser, make_cli
from uoapi.dates import scrape_dates

description = ""
help = ""
epilog = ""

@make_parser(description=description, epilog=epilog)
def parser(default):
    return default

@make_cli(parser)
def cli(args=None):
    for x in main():
        print(json.dumps(x))

def main():
    yield from scrape_dates()

if __name__ == "__main__":
    cli()
