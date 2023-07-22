import { BasicAcceptedElems, Element } from 'cheerio';

export const SUBJECT_URL = 'https://catalogue.uottawa.ca/en/courses/';
export const SUBJECT_REGEX = / \([A-Z]{3}\)/;
export const COURSE_LINK_SUFFIX = '/en/courses/';
export const SUBJECT_SELECTOR: BasicAcceptedElems<Element> = 'div.az_sitemap > ul > li > a';
