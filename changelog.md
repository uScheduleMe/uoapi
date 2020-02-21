# Version `1.0.0dev5`
- Normalized whitespace in output strings (e.g. replacing `&nbsp;` and `\xa0` with a space)
- Capitalized all standard labels (e.g. subject/course codes, section/component labels, session types, etc.)
except for term, which are lowered (winter, summer, fall)
- Changed `subject`/`course` to `subject_code`/`course_code`
- *N.B.* This may break applications which traverse the JSON structure
- *N.B.* This may break applications which use the standard labels from other sources (or hard-coded)