import argparse
import functools as ft
from importlib import import_module

###############################################################################
#               UTILITIES
###############################################################################

def make_parser(**kwargs):
    def parser_decorator(function):
        @ft.wraps(function)
        def parser(default=None):
            if default is None:
                default = argparse.ArgumentParser(**kwargs)
            return function(default)
        return parser
    return parser_decorator

def make_cli(default_parser):
    def cli_decorator(function):
        @ft.wraps(function)
        def cli(args=None):
            if isinstance(args, str):
                args = args.split()
            if isinstance(args, list):
                args = default_parser().parse_args(args)
            elif args is None:
                args = default_parser().parse_args()
            elif not isinstance(args, argparse.Namespace):
                raise TypeError("Argument is not a str, list, or namespace")
            return function(args)
        return cli
    return cli_decorator

@make_parser()
def default_parser(parser):
    return parser

def noop(*args, **kwargs):
    pass

###############################################################################
#               CONFIGURATION
###############################################################################

subparser_names = [
    "template",
]

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
    
    # Add subparsers
    subparsers = parser.add_subparsers(title="actions")
    for i, name in enumerate(subparser_names):
        mod = import_module(name)
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
