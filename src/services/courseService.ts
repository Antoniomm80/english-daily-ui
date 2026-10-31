import axios from "axios";
import { Course } from "@/types/course"; // I'll create this type

const API_BASE_URL = "/english-daily/api/v1/englishdaily/courses";

export interface CourseService {
    getAll: () => Promise<Course[]>;
    create: (request: CreateCourseRequest) => Promise<void>;
    // Note: Delete and Update endpoints are not in the provided controller, 
    // but I will implement them assuming they exist as per CRUD requirements.
    delete: (id: string) => Promise<void>;
    update: (id: string, request: CreateCourseRequest) => Promise<void>;
}

export interface CreateCourseRequest {
    title: string;
    folderPath: string;
    vocabularySupported: boolean;
}

const courseService: CourseService = {
    async getAll() {
        const response = await axios.get<Course[]>(API_BASE_URL);
        return response.data;
    },
    async create(request) {
        await axios.post(API_BASE_URL, request);
    },
    async delete(id) {
        await axios.delete(`${API_BASE_URL}/${id}`);
    },
    async update(id, request) {
        await axios.put(`${API_BASE_URL}/${id}`, request);
    },
};

export default courseService;
