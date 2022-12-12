import requests
from bs4 import (
    BeautifulSoup,
    Tag,
)

from uoapi.course import (
    patterns as pt,
    utils,
    Prereq,
    parse,
)
from uoapi.course.models import (
    Subject,
    Course,
)

# Course Info Parameters
course_url = "https://catalogue.uottawa.ca/en/courses/"

#############################################################################
# COURSE INFO SCRAPING
#############################################################################


def scrape_subjects(url: str = course_url):
    """
    Scrapes the list of subjects with links to their respective course
    catalogues from the uOttawa website

    Args:
        url: The url to scrape from

    Returns:
        A list of Subject objects converted to dictionaries
    """
    page = requests.get(url).text
    soup = BeautifulSoup(page, "html.parser")

    match content := soup.find("div", attrs={"class": "az_sitemap"}):
        # BeautifulSoup doesn't provide type annotations so mypy doesn't
        # play nice with this in a case statement
        case Tag():  # type: ignore
            pass
        case _:
            raise ValueError("Could not find div with class az_sitemap")

    subject_tags = utils.get_taglist_from_resultset(
        content.find_all(
            "a",
            attrs={"href": pt.href_re},
        )
    )

    subjects: list[Subject] = []

    for tag in subject_tags:
        subject = parse.subject_tag(tag, url)
        if subject is not None:
            subjects.append(subject)

    return [subject.dict() for subject in subjects]


def get_course_from_tag(tag: Tag):
    """
    Given a courseblock tag, extracts the course information from
    the tag and returns a Course object

    Args:
        tag: The courseblock tag

    Raises:
        ValueError: If the courseblocktitle tag cannot be found

    Returns:
        The course object
    """
    title_tag = tag.find("p", attrs={"class": "courseblocktitle"})

    if title_tag is None:
        raise ValueError("Could not find courseblocktitle")

    description_tag = tag.find("p", attrs={"class": "courseblockdesc"})

    block_tags = utils.get_taglist_from_resultset(
        tag.find_all(
            "div",
            attrs={"class": "courseblockextra"},
        )
    )

    code, title, credits = parse.title_tag(title_tag)
    description = parse.description_tag(description_tag)
    prereq_string, components = parse.extras_blocks(block_tags)

    description += "\n" + components
    description = description.strip()

    components = utils.get_description_content(components)

    dependencies = Prereq(prereq_string).prereqs
    prerequisites = utils.get_description_content(prereq_string)

    return Course(
        course_code=code,
        title=title,
        credits=credits,
        description=description,
        dependencies=dependencies,
        components=utils.split_component_parts(components),
        prerequisites=prerequisites,
    )


def get_courses(link: str):
    """
    Scrapes the page given by link for courses and their descriptions, components,
    prerequisites, etc.
    """
    raw_courses = BeautifulSoup(
        requests.get(link).text,
        "html.parser",
    )
    course_tags = utils.get_taglist_from_resultset(
        raw_courses.find_all(
            "div",
            attrs={"class": "courseblock"},
        )
    )

    for course_tag in course_tags:
        yield get_course_from_tag(course_tag).dict()
