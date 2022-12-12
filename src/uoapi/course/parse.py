from bs4 import (
    Tag,
    NavigableString,
)

from uoapi.course import (
    utils,
    patterns as pt,
)
from uoapi.course.models import (
    Subject,
)

from typing import (
    cast,
)


def title_tag(tag: Tag | NavigableString) -> tuple[str, str, int]:
    """
    Extracts course code, title, and credits from a courseblocktitle tag
    """
    title = utils.replace_special_spaces(tag.text)

    code = utils.extract_codes(title, False)[0]
    title = utils.remove_codes(title)

    credits = utils.extract_credits(title)
    title = utils.remove_credits(title)

    if (course_match := pt.code_groups.search(code)) is None:
        raise ValueError(f"Could not parse course code {code}")

    code = cast(str, course_match.groups()[1]).upper()

    return code, title, credits


def description_tag(tag: Tag | NavigableString | None) -> str:
    """
    Extracts the description of a course from a courseblockdesc tag
    """
    if tag is None:
        return ""

    description = utils.replace_special_spaces(tag.text)
    return description


def subject_tag(tag: Tag, url_prefix: str):
    if not tag.has_attr("href"):
        # TODO: Add log message here or crash
        return None

    match tag.string, tag["href"]:
        case str(label), str(href):
            path = utils.get_last_path_component(href)
            subject = utils.clean_subject_label(label)
            subject_code = path.upper()

            return Subject(
                subject=subject,
                subject_code=subject_code,
                link=url_prefix + path + "/",  # pyright: ignore
            )
        case s, h:
            raise ValueError(f"Expected strings, got {type(s)} and {type(h)}")


def extras_blocks(tags: list[Tag]) -> tuple[str, str]:
    """
    Extracts the prerequisites and components
    from a list of courseblockextra tags

    Args:
        tags: The list of courseblockextra tags

    Returns:
        A tuple containing the prerequisites and component strings.
        If the prerequisites or components are not found, an empty string
        is returned for that value.
    """
    blocks: list[str] = []

    for tag in tags:
        blocks.append(
            # No idea if the additional strips are necessary
            # but they were in the original code so I'm keeping them
            # for now
            utils.replace_special_spaces(tag.text)
            .strip(".")
            .strip()
            .strip(".")
            .strip()
        )

    match blocks:
        case [block] if utils.has_component(block):
            return "", block
        case [block] if utils.has_prerequisite(block):
            return block, ""
        case [pre, comp] | [comp, pre] if utils.is_prereq_and_component(pre, comp):
            return pre, comp
        case [block, _] | [_, block] if utils.is_prerequisite_string(block):
            return block, ""
        case [block, _] | [_, block] if utils.is_component_string(block):
            return "", block
        case _:
            pass

    return "", ""
