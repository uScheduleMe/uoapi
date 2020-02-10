Contributions are more than welcome!
If you are looking for ideas, check out the issues page
in the github repository for this project.
If you have an idea for a new feature,
create a new folder within the `uoapi` directory,
and place your code there.
Make sure you import (using absolute imports!)
all the functionality you would like to be accessible outside your
folder in an `__init__.py` in your folder.

If you would like your feature to be accessible via the CLI,
ensure you add the name of you module in the `__modules__` file
**below** any other modules which you may use.
Furthermore, you **must** define (or import) the strings
`cli_help`, `cli_description`, and `cli_epilog` (they may be empty)
and functions `parser` and `cli` in your module's `__init__.py`.
It is recommended that you define these in a `cli.py` file
in your folder which can be executed directly by python.
The `parser` and `cli` functions must be decorated with 
their respective `make_*` decorators from `cli_tools.py`.
Please also try to include a function `py_cli.py` which
replicates the functionality of your CLI inside python.
You may copy the `template` folder to get started.

To contribute, please fork this repository 
and submit a pull request to the `dev` branch with your contributions.
Make sure you are up to date with the latest changes before doing so.

For all new contributions, 
please write unit tests,
at least in the places where your tests would be simpler than your code.
This package uses `unittest`; please be consistent.
You can find out your code coverage with the following:
```bash
$ pip install coverage
$ coverage run -m unittest tests/<your module>/<your test file>.py
$ coverage report -m
```
To mock HTTP requests, this package uses `httmock`,
which is `pip`-installable.
For example usage, see the `httmock` homepage,
or `tests/timetable/test_query_timetable.py`.

Logging would also be appreciated.
Please make this configurable, and respect the global command line
`--log` flag.

# Versioning

We use `<major>.<minor>.<patch>` version numbering.
Major versions are reserved for non-backwards-compatible changes
or when the format of the HTML being scraped changes.
Minor versions are for the addition of backwards compatible changes.
Patch versions are for backwards compatible bug fixes.
Please update the git tag and update the changelog every time you commit a self-contained change.
