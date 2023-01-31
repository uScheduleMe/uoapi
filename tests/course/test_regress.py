import os
import json
from urllib.parse import urlparse

import pytest
from httmock import urlmatch, HTTMock

from uoapi.course.course_info import (
    course_url,
    scrape_subjects,
    get_courses,
)


def absolute_path(path):
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), path)


COURSE_URL_PARTS = urlparse(course_url)


def mock_subject_list(page: str):
    @urlmatch(
        method="GET",
        netloc=COURSE_URL_PARTS.netloc,
        path=COURSE_URL_PARTS.path,
    )
    def inner(_url, _request):
        return page
    return inner


@pytest.mark.regress
def test_subjects():
    with open(absolute_path("data/subjects.json"), "r") as f:
        subjects = json.load(f)
    with HTTMock(mock_subject_list(subjects["page"])):
        results = scrape_subjects(course_url)
        assert subjects["subjects"] == results, (
            "Differs from commit {}".format(subjects["commit"]),
        )


def mock_subject_page(link: str, page: str):
    url = urlparse(link)
    @urlmatch(
        method="GET",
        netloc=url.netloc,
        path=url.path,
    )
    def inner(_url, _request):
        return page
    return inner


@pytest.mark.regress
def test_courses():
    with open(absolute_path("data/courses.json"), "r") as f:
        course_data = json.load(f)
    commit = course_data["commit"]
    for subject in course_data["subjects"]:
        with HTTMock(mock_subject_page(subject["link"], subject["page"])):
            results = list(get_courses(subject["link"]))
            assert subject["courses"] == results, (
                "Differs from commit {}".format(commit),
            )
