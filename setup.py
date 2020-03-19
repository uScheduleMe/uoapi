# -*- coding: utf-8 -*-

import io
import os
import sys
import re

from setuptools import find_packages, setup, Command

#from uoapi import __version__

here = os.path.abspath(os.path.dirname(__file__))

# Package meta-data.
NAME = 'uoapi'
DESCRIPTION = 'An API for retrieving public data from the University of Ottawa.'
URL = 'https://github.com/andrewnags/uoapi'
EMAIL = 'anaga042@uottawa.ca'
AUTHOR = 'Andrew Nagarajah'
REQUIRES_PYTHON = '>=3.6.0'
#VERSION = __version__
with io.open(os.path.join(here, "uoapi", "__version__.py")) as f:
    VERSION = re.search("__version__\\s*=\\s*['\"]([^'\"]+)['\"]", f.read()).groups()[0].strip()

# What packages are required for this module to be executed?
REQUIRED = [
    'requests', 'regex', 'bs4', 'lxml', 'pandas', 'parsedatetime'
]

# What packages are optional?
EXTRAS = {
    # 'fancy feature': ['django'],
}

# The rest you shouldn't have to touch too much :)
# ------------------------------------------------
# Except, perhaps the License and Trove Classifiers!
# If you do change the License, remember to change the Trove Classifier for that!


# Import the README and use it as the long-description.
# Note: this will only work if 'README.md' is present in your MANIFEST.in file!
try:
    with io.open(os.path.join(here, 'README.md'), encoding='utf-8') as f:
        long_description = '\n' + f.read()
except FileNotFoundError:
    long_description = DESCRIPTION

# Load the package's __version__.py module as a dictionary.
about = {}
#if not VERSION:
#    project_slug = NAME.lower().replace("-", "_").replace(" ", "_")
#    with open(os.path.join(here, project_slug, '__version__.py')) as f:
#        exec(f.read(), about)
#else:
#    about['__version__'] = VERSION
about['__version__'] = VERSION

# Find modules
with open(os.path.join("uoapi", "__modules__"), "r") as f:
    modules = ["uoapi"] + ["uoapi." + x.strip() for x in f.readlines()]


# Where the magic happens:
setup(
    name=NAME,
    version=about['__version__'],
    description=DESCRIPTION,
    long_description=long_description,
    long_description_content_type='text/markdown',
    author=AUTHOR,
    author_email=EMAIL,
    python_requires=REQUIRES_PYTHON,
    url=URL,
    packages=modules,
    #packages=find_packages(
    #    #exclude=["tests", "*.tests", "*.tests.*", "tests.*"],
    #),
    package_dir={"uoapi": "uoapi"},
    package_data = {"uoapi": ["__modules__"]
        + [os.path.join(mod, "data", "*") for mod in modules]
    },
    # If your package is a single module, use this instead of 'packages':
    # py_modules=['mypackage'],

    entry_points={
        'console_scripts': ['uoapi=uoapi.cli:cli'],
    },
    inclue_package_data=True,
    install_requires=REQUIRED,
    extras_require=EXTRAS,
    include_package_data=True,
    license='LGPLv3+',
    classifiers=[
        # Trove classifiers
        # Full list: https://pypi.python.org/pypi?%3Aaction=list_classifiers
        'Development Status :: 2 - Pre-Alpha',
        'Environment :: Console',
        'Intended Audience :: Education',
        'License :: OSI Approved :: GNU Lesser General Public License v3 or later (LGPLv3+)',
        'Natural Language :: English',
        'Natural Language :: French',
        'Operating System :: Microsoft :: Windows',
        'Operating System :: POSIX',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: Implementation :: CPython',
        'Topic :: Education',
        'Topic :: Internet :: WWW/HTTP :: Indexing/Search',
    ],
)
