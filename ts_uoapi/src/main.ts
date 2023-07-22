import { scrapeSubjects } from './subjects/services/scrapeSubjects';
import { TEST_HTML } from './timetable/constants';
import { extractTimetable } from './timetable/services/parseTimetable';

void main();

async function main(): Promise<void> {
  void scrapeSubjects();

  extractTimetable(TEST_HTML, undefined, undefined);

  // for (let subject of subjects) {
  //   fetchCourses(subject.link);
  // }
}
