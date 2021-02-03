import argparse

from uoapi.cli_tools import make_parser, make_cli

description = ""
help = ""
epilog = ""

@make_parser(description=description, epilog=epilog)
def parser(default):
    raise NotImplementedError()

@make_cli(parser)
def cli(args=None):
    raise NotImplementedError()

def main():
    raise NotImplementedError()

if __name__ == "__main__":
    cli()
