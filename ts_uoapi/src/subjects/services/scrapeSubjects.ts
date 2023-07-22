import { fetchUrlText } from '../../common/util/fetchUtil';
import { SUBJECT_URL } from '../constants';

export const scrapeSubjects = async (): Promise<string> => fetchUrlText(SUBJECT_URL);
