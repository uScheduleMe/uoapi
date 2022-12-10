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
