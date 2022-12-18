import sys

import regex as re

import uoapi.course.patterns as pt


from typing import Any
from bs4 import (
    ResultSet,
    Tag,
)


def extract_codes(string: str, return_all: bool = True):
    """
    Returns course codes found in string;
    if multiple codes are found and return_all is False, then returns an invalid code
    Used in get_subjects.ipynb"""
    codes = list({x.group(0) for x in re.finditer(pt.code_re, string)})
    if return_all or len(codes) == 1:
        return codes
    return ["XXX 0000"]


def extract_credits(string: str):
    """
    Searches string for a number of credits/units
    (Assuming the string is the title of a course)
    Used in get_subjects.ipynb
    """
    credits = list(
        {
            int(x.group(0).split(" ")[0].strip("("))
            for x in re.finditer(pt.credit_re, string)
        }
    )
    if len(credits) == 1:
        return credits[0]
    return 0


def remove_codes(string: str):
    """
    Removes course codes from string

    Args:
        string: String to remove course codes from

    Returns:
        String with course codes removed
    """
    return re.sub(pt.code_re, "", string).strip()


def remove_credits(string: str):
    """
    Removes credits from string

    Args:
        string: String to remove credits from

    Returns:
        String with credits removed
    """
    return re.sub(pt.credit_re, "", string).strip()


def get_taglist_from_resultset(results: ResultSet[Any]) -> list[Tag]:
    """
    Returns a list of tags from a ResultSet
    """

    tags: list[Tag] = []

    for result in results:
        match result:
            case Tag():  # type: ignore
                tags.append(result)
            case _:
                print(result, file=sys.stderr)
                raise ValueError(f"Unexpected type in resultset from result {result}")

    return tags


def get_last_path_component(url: str) -> str:
    """
    Returns the last component of a URL path
    """
    return url.strip("/").rsplit("/")[-1].strip().strip("/")


def clean_subject_label(label: str) -> str:
    """
    Sanitizes subject labels according to the subj_re pattern
    """

    return pt.subj_re.sub("", label).strip()


def has_prerequisite(string: str) -> bool:
    """
    Checks if a string contains a prerequisite
    """
    return "Prerequisite" in string or "Préalable" in string


def has_component(string: str) -> bool:
    """
    Checks if a string contains a course component
    """
    return "Course Component" in string or "Volet" in string


def is_prerequisite_string(string: str) -> bool:
    """
    Checks if a string is a prerequisite string exclusively
    """
    return has_prerequisite(string) and not has_component(string)


def is_component_string(string: str) -> bool:
    """
    Checks if a string is a component string exclusively
    """
    return has_component(string) and not has_prerequisite(string)


def is_prereq_and_component(prereq: str, component: str) -> bool:
    """
    Checks if a pair of strings satisfy the condition that the first is a prerequisite
    and the second is a component.

    This is used to simplify pattern matching

    Args:
        prereq: A string that may or may not be a prerequisite
        component: A string that may or may not be a component

    Returns:
        True if the strings are a prerequisite and a component respectively,
        False otherwise
    """
    return is_prerequisite_string(prereq) and is_component_string(component)


def get_description_content(string: str) -> str:
    """
    Returns the content after the first colon in a description string
    """

    return string.split(":", 1)[-1].strip()


def split_component_parts(components: str) -> list[str]:
    """
    Splits a components string into a list of individual components.
    """

    return [
        component.strip().upper() for component in components.split("/")[-1].split(",")
    ]


def replace_special_spaces(string: str) -> str:
    """
    Removes special spaces from a string
    """

    return string.replace("\xa0", " ").replace("&nbsp;", " ").strip()
