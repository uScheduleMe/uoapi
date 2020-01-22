import argparse

from uoapi import make_parser, make_cli
try:
    from template.template_functions import ford
except ModuleNotFoundError:
    from template_functions import ford

description = "A template for how to create modules"
help = "state the name of Arthur Dent's best friend"
epilog = "This is the epilogue"

@make_parser(description=description, epilog=epilog)
def parser(default):
    # Replace this code with whatever operations
    # are needed to create a parser for your module.
    default.add_argument("-t", "--time",
        action="store_true",
        help="time the operation of this script",
    )
    default.add_argument("-o", "--outfile",
        action="store",
        nargs="?",
        dest="out",
        metavar="OUTFILE",
    )
    # End replace.

    return default

@make_cli(parser)
def cli(args=None):
    # Do whatever with the arguments in `args`.
    if getattr(args, "time", False):
        import time
        start = time.perf_counter()
    if getattr(args, "outfile", False):
        with open(args.outfile, "w") as f:
            print(f"ford {ford}", file=f)
    else:
        print(f"ford {ford}")
    if getattr(args, "time", False):
        if getattr(args, "log", False):
            with open(args.log, "a") as f:
                print(time.perf_counter() - start, file=f)
        else:
            import sys
            print(time.perf_counter() - start, file=sys.stderr)
    # End do.

if __name__ == "__main__":
    cli()
