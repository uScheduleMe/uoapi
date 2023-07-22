import { Subject } from '..';
import { parseSubjects } from './parseSubjects';
import { scrapeSubjects } from './scrapeSubjects';

export const fetchSubjects = async (): Promise<Subject[]> => parseSubjects(await scrapeSubjects());
