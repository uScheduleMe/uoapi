export interface Course {
    title: string;
    course_code: string;
    credits: number;
    description?: string;
    prerequisites?: string;
    components_fr: string[];
    components_en: string[];
    // todo dependencies: string[]???
}
