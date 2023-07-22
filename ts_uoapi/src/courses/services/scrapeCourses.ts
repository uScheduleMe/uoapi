import { fetchUrlText } from '../../common/util/fetchUtil';

export const scrapeCourses = async (course_url: string): Promise<string> =>
  fetchUrlText(course_url);
