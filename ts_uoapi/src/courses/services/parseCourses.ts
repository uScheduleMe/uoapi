import { CheerioAPI, load, Element } from 'cheerio';
import { Course } from '../models/Course';
import { extractCourseTitleInfo } from './extractCourseTitleInfo';
import { TitleInfo } from '../models/TitleInfo';
import { courseBlockSelector } from '../constants';

export const parseCourses = (html: string): Course[] => {
  const courses: Course[] = [];
  const $: CheerioAPI = load(html);

  $(courseBlockSelector).each((_i: number, element: Element) => {
    const title_info: TitleInfo = extractCourseTitleInfo($, element);
  });

  return courses;
};
