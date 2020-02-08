import importlib
import os

from . import cli_tools
from .__version__ import __version__

with open(cli_tools.absolute_path("__modules__"), "r") as f:
    modules = [x.strip() for x in f.readlines()]
for mod in modules:
    globals()[mod] = importlib.import_module("uoapi." + mod)


from . import cli

__all__ = modules
