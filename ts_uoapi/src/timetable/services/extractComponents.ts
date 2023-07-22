import {
  getImgAltAttribute,
  getTextElementData,
  mapAnyNodeToStringArray,
} from '../../common/util/parseUtil';
import { CheerioAPI, Cheerio, AnyNode, Element } from 'cheerio';
import {
  COURSE_SECTION_NAME_SELECTOR,
  COURSE_SECTION_REGEX,
  COURSE_SECTION_STATUS_SELECTOR,
  COURSE_SECTION_ROOMS_SELECTOR,
  COURSE_SECTION_INSTRUCTOR_SELECTOR,
  COURSE_SECTION_TOPIC_SELECTOR,
  DATE_REGEX,
} from '../constants';
import { Component } from '../models/Component';

export const extractComponents = (
  $: CheerioAPI,
  section_element: Element,
  description: string,
  will_log: boolean = false,
  error_message_prefix: string = '',
): [Component[], string[]] => {
  const getSectionId = (section_class_name: Cheerio<AnyNode>): string =>
    getTextElementData(section_class_name[0]).trim().toUpperCase();

  const getSectionType = (section_class_name: Cheerio<AnyNode>): string =>
    getTextElementData(section_class_name[section_class_name.length - 1]).trim();

  const section_class_name: Cheerio<AnyNode> = $(section_element)
    .find(COURSE_SECTION_NAME_SELECTOR)
    .contents();
  const section_id = getSectionId(section_class_name);
  const section_type = getSectionType(section_class_name);

  const section_match: RegExpMatchArray | null = section_id.match(COURSE_SECTION_REGEX);
  const id: string = section_match ? section_match[1] : '';
  const type: string = section_match ? section_match[2] : '';

  const status_element: Cheerio<Element> = $(section_element).find(COURSE_SECTION_STATUS_SELECTOR);
  const status: string = getImgAltAttribute($(status_element)).trim().toUpperCase();

  const component_out: any = {
    label: section_id.trim().toUpperCase(),
    section_id: id.trim().toUpperCase(),
    type: type.trim().toUpperCase(),
    session_type: section_type.replace('.', '').trim().toUpperCase(),
    status,
    description,
  };
  console.log(component_out);

  // TODO
  const rooms: string[] = mapAnyNodeToStringArray(
    $(section_element).find(COURSE_SECTION_ROOMS_SELECTOR),
  );
  console.log(rooms);
  const instructors: string[] = mapAnyNodeToStringArray(
    $(section_element).find(COURSE_SECTION_INSTRUCTOR_SELECTOR),
  );
  console.log(instructors);
  const topic_data: string[] = mapAnyNodeToStringArray(
    $(section_element).find(COURSE_SECTION_TOPIC_SELECTOR),
  );
  console.log(topic_data);
  const topic: string[][] = [];
  topic_data.forEach((value: string) => {
    const group = value.match(DATE_REGEX);
    console.log(group);
    const dates: string[] = [];
    if (group?.length !== 2) {
      // TODO log
      dates.push(...padArray(group?.slice() ?? [], 2));
    } else {
      dates.push(...group.slice(0, 1));
    }
    topic.push(dates);
  });
  console.log(topic);

  return [[], []]; // TODO
};

export const padArray = (arr: string[], length: number): string[] => {
  if (arr.length === length) {
    return arr;
  }

  while (arr.length < length) {
    arr.push('');
  }

  return arr;
};
