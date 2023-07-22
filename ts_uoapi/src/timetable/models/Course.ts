import { Section } from './Section';

export interface Course {
  subject_code: string;
  course_code: string;
  course_name: string;
  sections: Section[];
  messages: any[]; // TODO
}
