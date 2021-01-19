
from uoapi.course import patterns
from uoapi.course.prereq import Prereq
from uoapi.course.course_info import scrape_subjects, get_courses
from uoapi.course.cli import (parser, cli, main as py_cli,
    help as cli_help, description as cli_description, epilog as cli_epilog
)
