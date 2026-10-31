export interface Course {
    id: string;
    title: string;
    folderPath: string;
    vocabularySupported: boolean;
}

export interface CreateCourseRequest {
    title: string;
    folderPath: string;
    vocabularySupported: boolean;
}
