import { CheerioAPI, Element } from 'cheerio';
import { TitleInfo } from '../models/TitleInfo';
import { courseBlockTitleSelector, creditRegex } from '../constants';
import { COURSE_CODE_REGEX } from '../../common/constants';

export const extractCourseTitleInfo = ($: CheerioAPI, element: Element): TitleInfo => {
  const extractCourseCode = (text: string): string => {
    const code_groups: RegExpMatchArray | null = text.match(COURSE_CODE_REGEX);
    if (code_groups && code_groups.length === 3) {
      return code_groups[2];
    }
    // TODO log error
    console.log('CODE ERROR');

    return ''; // TODO
  };

  const extractCredits = (text: string): number | undefined => {
    const credits = text.match(creditRegex);
    if (credits?.groups) {
      if (credits.groups[0]) {
        return +credits.groups[0];
      }
      if (credits.groups[1]) {
        return +credits.groups[1];
      }
      if (credits.groups[2] && credits.groups[3]) {
        if (credits.groups[2] === credits.groups[3]) {
          return +credits.groups[2];
        }
        // TODO log error
        console.log('CREDITS MISMATCH');
      }
    } else {
      // TODO log error
      console.log('CREDIT ERROR');
    }
  };

  const extractCourseTitle = (text: string): string => {
    let title_string: string = text.replace(creditRegex, '');
    title_string = text.replace(COURSE_CODE_REGEX, '');
    return title_string;
  };

  const course_block_title: string = $(element).find(courseBlockTitleSelector).text();

  const code: string = extractCourseCode(course_block_title);
  const credit: number | undefined = extractCredits(course_block_title);
  const title: string = extractCourseTitle(course_block_title);

  return { title, code, credit };
};
