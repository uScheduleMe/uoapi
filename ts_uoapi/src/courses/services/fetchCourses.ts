import { Course } from '../models/Course';
import { parseCourses } from './parseCourses';
import { scrapeCourses } from './scrapeCourses';

export const fetchCourses = async (link: string): Promise<Course[]> =>
  parseCourses(await scrapeCourses(link));
