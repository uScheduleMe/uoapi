import os
import argparse
import itertools as it
import functools as ft
from importlib import import_module

from src.api_tools import absolute_path, default_parser, noop, make_cli


###############################################################################
#               CONFIGURATION
###############################################################################

#modules = [
#    "example",
#]
with open(absolute_path("__modules__"), "r") as f:
    modules = [x.strip() for x in f.readlines()]

###############################################################################
#               GLOBAL PARSER AND CLI
###############################################################################

def uoapi_parser():
    parser = argparse.ArgumentParser()
    
    # Global arguments
    parser.add_argument("-v", "--verbose",
       help="Increase verbosity",
    )
    parser.add_argument("-l", "--log",
       help="Log to this file"
    )
    parser.set_defaults(func=noop)
    
    # Add subparsers
    subparsers = parser.add_subparsers(title="actions")
    for name in modules:
        mod = import_module("src." + name)
        sp = getattr(
            mod,
            "parser",
            default_parser
        )(subparsers.add_parser(
            name,
            description=getattr(mod, "description", ""),
            help=getattr(mod, "help", ""),
            epilog=getattr(mod, "epilog", None),
        ))
        sp.set_defaults(func=getattr(
            mod,
            "cli",
            noop
        ))
    return parser

@make_cli(uoapi_parser)
def cli(args=None):
    args.func(args)
    
if __name__ == "__main__":
    cli()
