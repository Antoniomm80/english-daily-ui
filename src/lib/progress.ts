// Client-side learning progress. The backend has no notion of users or progress,
// so we keep it in localStorage: which lessons were studied and the last one opened.

const STUDIED_KEY = "englishdaily.studied-lessons";
const LAST_LESSON_KEY = "englishdaily.last-lesson";

function read<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function write(key: string, value: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // storage unavailable (private mode, quota): progress is best effort
    }
}

export function getStudiedLessons(): Set<number> {
    return new Set(read<number[]>(STUDIED_KEY, []));
}

export function markLessonStudied(id: number) {
    const studied = getStudiedLessons();
    studied.add(id);
    write(STUDIED_KEY, [...studied]);
}

export function getLastLessonId(): number | undefined {
    return read<number | undefined>(LAST_LESSON_KEY, undefined);
}

export function setLastLessonId(id: number) {
    write(LAST_LESSON_KEY, id);
}
