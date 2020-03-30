### Version `1.0.0dev5`

#### Timetable
- Normalized whitespace in output strings (e.g. replacing `&nbsp;` and `\xa0` with a space)
- Capitalized all standard labels (e.g. subject/course codes, section/component labels, session types, etc.)
except for term, which are lowered (winter, summer, fall)
- Changed `subject`/`course` to `subject_code`/`course_code`
- **N.B.** This may break applications which traverse the JSON structure
- **N.B.** This may break applications which use the standard labels from other sources (or hard-coded)


### Version `1.0.0dev6`

#### Timetable
- Updated tests to match new field names
- Added periodic connection refresh to `TimetableQuery`
- Added check for when queries exceed the maximum number of results allowed by the University
- Updated link to webpage
- Explicitly specify encoding as UTF-8 when saving HTML


### Version `1.0.0dev7`

#### Timetable
- Moved the ability to save queried HTML to `TimetableQuery`
- Improved logging


### Version `1.0.0dev8`
- Added native logging config


### Version `1.0.0dev9`
- Added NullHandler to suppress default logging
- Fixed logging bug

#### Timetable
- Updated tests
- Made `"section_id"`s optional
- Parsed separate case of "No classes found"
- Refresh and retry when unknown errors are encountered


### Version `1.0.0dev10`

#### Timetable
- Improved CLI help pages
- Added ability to search for course code with comparison (less/greater than, in)


### Version `1.0.0dev11`

#### Timetable
- Increased default refresh rate, sleep/wait times
- Changed `"course_number"` to `"course_code"`
- Changed field name from `"courses"` to `"timetables"`
