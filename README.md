### NOTE

Since writing, the university has changed their timetable search tool, so that part of this project no longer works (and fails silently).

The rest should work fine.

### License

¯\\_(ツ)_/¯


Next steps:

	- ~~document~~

	- ~~move functions to uO_scrape.py, leaving operations and operation specific helpers in notebooks~~

	- create pre-/co-requisite forest

	- schedule classes

	- parse program requirements/sequences

	- schedule courses

	- GUI

	- query for courses by schedule

	- add RateMyProf references




get_subjects.ipynb:

	- scrapes subjects, outputs uOttawa_subjects.csv

	- scrapes courses, outputs uOttawa_courses.json and uOttawa_courses.csv



get_schedules.ipynb:

	- scrapes course offerings either all at once (producing uOttawa_offerings_quick.csv) or individually (uOttawa_offerings_long.csv)

	- scrapes schedules, but does not save



Query Features:

	- by pre-/co-requisite:

		- if the user supplies count

		- if the user supplies a list

	- by schedule compatibility

		- wrt times

		- wrt terms

	- by prof

		- RMP rating

		- list



Scheduling Priorities:

	- having consecutive v. non-consecutive

	- ending early

	- starting late

	- being spread out over many days or concentrated in fewer days 