# -*- coding: utf-8 -*-

import io
import os
import re

from setuptools import find_packages, setup


here = os.path.abspath(os.path.dirname(__file__))

# Package meta-data.
NAME = 'uoapi'
DESCRIPTION = 'An API for retrieving public data from the University of Ottawa.'
URL = 'https://github.com/andrewnags/uoapi'
EMAIL = 'anaga042@uottawa.ca'
AUTHOR = 'Andrew Nagarajah'
REQUIRES_PYTHON = '>=3.6.0'
with io.open(os.path.join(here, "src/uoapi", "__version__.py")) as f:
    m = re.search("__version__\\s*=\\s*['\"]([^'\"]+)['\"]", f.read())
    if m:
        VERSION = m.groups()[0].strip()
    else:
        raise ValueError('Version is not properly configured')

# What packages are required for this module to be executed?
REQUIRED = [
    'requests', 'regex', 'bs4', 'lxml', 'pandas', 'parsedatetime'
]

# What packages are optional?
EXTRAS = {
    'tests': ['pytest', 'pytest-cov', 'httmock'],
}

try:
    with io.open(os.path.join(here, 'README.md'), encoding='utf-8') as f:
        long_description = '\n' + f.read()
except FileNotFoundError:
    long_description = DESCRIPTION

# Load the package's __version__.py module as a dictionary.
about = {}
about['__version__'] = VERSION


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
    packages=find_packages('src'),
    package_dir={'': 'src'},
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
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: Implementation :: CPython',
        'Topic :: Education',
        'Topic :: Internet :: WWW/HTTP :: Indexing/Search',
    ],
)
