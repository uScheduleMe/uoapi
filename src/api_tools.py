import os
import argparse
import functools as ft

###############################################################################
#               UTILITIES
###############################################################################

def absolute_path(path):
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), path)

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
