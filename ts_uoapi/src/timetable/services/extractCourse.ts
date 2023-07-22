import { CheerioAPI, Cheerio, Element } from 'cheerio';
import {
  COURSE_TITLE_SELECTOR,
  COURSE_SECTION_SELECTOR,
  COURSE_DESCRIPTION_SELECTOR,
} from '../constants';
import { Course } from '../models/Course';
import { extractComponents } from './extractComponents';
import { COURSE_CODE_REGEX } from '../../common/constants';
import { Component } from '..';

export const extractCourse = (
  $: CheerioAPI,
  course_element: Element,
  year: any, // TODO
  term: any, // TODO
  will_log: boolean = false, // TODO
): Course => {
  let course_name: string = $(course_element).find(COURSE_TITLE_SELECTOR).text();
  const code_match: RegExpMatchArray | null = course_name.match(COURSE_CODE_REGEX);

  const [subject_code, course_code]: string[] = code_match ? code_match.slice(1, 3) : ['', ''];
  course_name = course_name.replace(COURSE_CODE_REGEX, '').replace('-', '').trim();

  const course_out: Course = {
    subject_code,
    course_code,
    course_name,
    sections: [],
    messages: [],
  };
  const course_components: Component[] = [];

  $(course_element)
    .find(COURSE_SECTION_SELECTOR)
    .each((_i: number, section_element: Element) => {
      const subsection: Cheerio<Element> = $(section_element).find(COURSE_SECTION_SELECTOR);
      console.log(subsection);
      if (subsection.length > 0) {
        const description: string = $(section_element).find(COURSE_DESCRIPTION_SELECTOR).text();
        const [components, messages]: [Component[], string[]] = extractComponents(
          $,
          section_element,
          description,
          will_log,
          `${term} ${year}, ${course_out.subject_code}${course_out.course_code}`, // TODO pull out into helper func
        );
        console.log(components);
        course_components.push(...components);
        course_out.messages.push(...messages);
      }
    });

  // TODO process sections
  // grouped_sections = group_by_eq(
  //     course_out["sections"],
  //     lambda x: x["section_id"]
  // )
  // course_out["sections"] = [{
  //     "year": year,
  //     "term": term.strip().lower(),
  //     "label": id_.strip().upper(),
  //     "components": components
  // } for id_, components in grouped_sections.items()]
  console.log(course_out);

  return course_out;
};
