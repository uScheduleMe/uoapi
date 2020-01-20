import argparse

def default_parser(parser):
    return parser
subparser_names = [
]

parser = argparse.ArgumentParser()

# Global arguments
parser.add_argument("-v", "--verbose",
   help="Increase verbosity",
)
parser.add_argument("-l", "--log",
   help="Log to this file"
)

# Add subparsers
subparsers = parser.add_subparsers()
for i, name in enumerate(subparser_names):
    subparser = subparsers.add_subparsers(name)
    subparser_names[i] = [name, import_module(name)]
    subparser_names[i].append(getattr(
        subparser_names[i][1],
        "parser",
        default_parser
    )(subparser))
    
