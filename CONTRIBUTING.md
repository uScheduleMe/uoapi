To contribute, please fork this repository and submit a pull request with your contributions.

Please write unit tests for your contributions,
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

# Versioning

We use `<major>.<minor>.<patch>` version numbering.
Major versions are reserved for non-backwards-compatible changes
or when the format of the HTML being scraped changes.
Minor versions are for the addition of backwards compatible changes.
Patch versions are for backwards compatible bug fixes.
Please update the git tag and update the changelog every time you commit a self-contained change.