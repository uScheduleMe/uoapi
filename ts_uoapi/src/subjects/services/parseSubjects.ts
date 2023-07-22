import { CheerioAPI, load, Element } from 'cheerio';
import { Subject } from '..';
import { COURSE_LINK_SUFFIX, SUBJECT_REGEX, SUBJECT_SELECTOR, SUBJECT_URL } from '../constants';
import { getHrefAttribute } from '../../common/util/parseUtil';

export const parseSubjects = (html: string): Subject[] => {
  const SUBJ_CODE_START_INDEX = 12;
  const SUBJ_CODE_END_INDEX = 15;

  const extractSubjectName = (element: Element): string =>
    $(element).text().replace(SUBJECT_REGEX, '');
  const extractSubjectCode = (link_text: string): string =>
    link_text.slice(SUBJ_CODE_START_INDEX, SUBJ_CODE_END_INDEX);
  const getFullSubjectLink = (code: string): string => SUBJECT_URL.concat(code);

  const subjects: Subject[] = [];
  const $: CheerioAPI = load(html);

  $(SUBJECT_SELECTOR).each((_i: number, element: Element) => {
    const subject: string = extractSubjectName(element);
    let link: string = getHrefAttribute(element);

    if (link.includes(COURSE_LINK_SUFFIX)) {
      const subject_code: string = extractSubjectCode(link);
      link = getFullSubjectLink(subject_code);
      subjects.push({ subject, subject_code, link });
    } else {
      console.log('ERROR');
      // TODO log issue
    }
  });
  return subjects;
};
