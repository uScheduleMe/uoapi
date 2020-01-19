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
