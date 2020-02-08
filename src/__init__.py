import importlib
import os

from . import api_tools
from .__version__ import __version__

with open(api_tools.absolute_path("__modules__"), "r") as f:
    modules = [x.strip() for x in f.readlines()]
for mod in modules:
    globals()[mod] = importlib.import_module("src." + mod)


from . import uoapi

__all__ = modules
