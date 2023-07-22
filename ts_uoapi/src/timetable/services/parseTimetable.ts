import { CheerioAPI, Element, load } from 'cheerio';
import { TIMETABLE_COURSE_SELECTOR } from '../constants';
import { Section } from '../models/Section';
import { extractCourse } from './extractCourse';
import { Course } from '../models/Course';

export const parseTimetable = () => undefined; // TODO

export const extractTimetable = (
  text: string,
  year: any,
  term: any,
  will_log: boolean = false,
): Course[] => {
  const $: CheerioAPI = load(text);
  const courses: Course[] = [];
  $(TIMETABLE_COURSE_SELECTOR).each((_i: number, element: Element) => {
    const course: Course = extractCourse($, element, undefined, undefined);
    // TODO perhaps move distribute sections into extract course
    course.sections = distributeSharedSections(
      course.sections,
      course.messages,
      will_log,
      `${term} ${year}, ${course.subject_code}${course.course_code}`,
    );
  });
  return courses;
};

export const distributeSharedSections = (
  sections: Section[],
  messages: any,
  will_log: boolean = false,
  error_message_prefix: string = '',
): Section[] => {
  const section_components: any = {};
  for (const section of sections) {
    section_components[section.label] = [];
    for (const component of section.components) {
      if (!section_components[section.label].includes(component.type)) {
        section_components[section.label].push(component.type);
      }
    }
  }
  // TODO array lookup thingy

  const sections_out: Section[] = [];
  const bad_section_ids: string[] = [];
  for (const section of sections) {
    if (section.label in bad_section_ids) {
      continue;
    }
    // TODO
  }

  return sections_out;
};
