from pydantic import (
    BaseModel,
    HttpUrl,
)


class Subject(BaseModel):
    subject: str
    subject_code: str
    link: HttpUrl


class Course(BaseModel):
    course_code: str
    title: str
    credits: int
    description: str
    components: list[str]
    prerequisites: str
    dependencies: list[list[str]]


# TODO: Refactor logic in Prereq into this class
class Prerequisite(BaseModel):
    content: str

    @classmethod
    def try_parse(cls, string: str):
        """
        Checks if a string contains a prerequisite
        """
        if "Prerequisite" in string or "Préalable" in string:
            return cls(content=string)

        return None


# TODO: Encapsulate component parsing logic in this class
class Component(BaseModel):
    content: str

    @classmethod
    def try_parse(cls, string: str):
        """
        Checks if a string contains a course component
        """
        if "Course Component" in string or "Volet" in string:
            return cls(content=string)

        return None
