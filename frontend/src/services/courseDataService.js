import { ScraperType } from "../data/ScraperType";

const baseUrls = {
    [ScraperType.NATIVE]: '',
    [ScraperType.UBCCOURSESAPI]: 'https://api.ubccourses.com'
}

let depts;

const getAllSubjects = {
    [ScraperType.NATIVE]: async (session) => {
        const url = `${baseUrls[ScraperType.NATIVE]}/departments`;
        const data = await fetch(url).then(res => res.json());
        const departments = data.departments;
        depts = departments;
        return Object.values(departments)
            .map(dept => { 
                return { ...dept, session };
            });
    },
    [ScraperType.UBCCOURSESAPI]: async (session) => {
        const url = `${baseUrls[ScraperType.UBCCOURSESAPI]}/subject`;
        const res = (await (await fetch(url)).json()).subjects;
        return res.filter(subject => subject.hasCourses).map(subject => ({ ...subject, session }));
    }
}

const searchDept = {
    [ScraperType.NATIVE]: async (deptKey, session) => {
        const url = `${baseUrls[ScraperType.NATIVE]}/courses/${deptKey}`;
        const deptSearchResult = await fetch(url).then(res => res.json());
        if (!deptSearchResult) {
            throw new Error(`'${deptKey}' is not a valid department`);
        }
        const dept = depts.find(dept => dept.subjCode === deptKey);
        deptSearchResult['session'] = session;
        deptSearchResult['subjCode'] = dept.subjCode;
        deptSearchResult['title'] = dept.title;
        deptSearchResult['faculty'] = dept.faculty;
        return deptSearchResult;
    },
    [ScraperType.UBCCOURSESAPI]: async (deptKey, session) => {
        const subjectsUrl = `${baseUrls[ScraperType.UBCCOURSESAPI]}/subject`;
        const subjects = (await (await fetch(subjectsUrl)).json()).subjects;
        const subjectData = subjects.find(subj => subj.subject === deptKey);
        if (typeof subjectData === 'undefined') throw new Error(`'${deptKey}' is not a valid department`);
        const coursesUrl = `${baseUrls[ScraperType.UBCCOURSESAPI]}/course/${deptKey}`;
        const courses = (await (await fetch(coursesUrl)).json()).courses;
        return {
            ...subjectData,
            courses,
            session
        }
    }
}

const searchCourse = {
    [ScraperType.NATIVE]: async (deptKey, courseKey, session) => {
        const url = `${baseUrls[ScraperType.NATIVE]}/course/${deptKey}/${courseKey}`;
        const courseSearchResult = await fetch(url).then(res => res.json());
        if (!courseSearchResult) {
            throw new Error(`'${deptKey} ${courseKey}' is not a valid course`);
        }
        courseSearchResult['session'] = session;
        return courseSearchResult;
    },
    [ScraperType.UBCCOURSESAPI]: async (deptKey, courseKey, session) => {
        const coursesUrl = `${baseUrls[ScraperType.UBCCOURSESAPI]}/course/${deptKey}`;
        const courses = (await (await fetch(coursesUrl)).json()).courses;
        const courseData = courses.find(course => course.course === courseKey);
        if (typeof courseData === 'undefined') throw new Error(`'${deptKey} ${courseKey}' is not a valid course`);
        const sectionsUrl = `${baseUrls[ScraperType.UBCCOURSESAPI]}/section/${deptKey}/${courseKey}`;
        const sections = (await (await fetch(sectionsUrl)).json()).sections;
        return {
            ...courseData,
            sections,
            session
        }
    }
}

const searchSection = {
    [ScraperType.NATIVE]: async (deptKey, courseKey, sectionKey, session) => {
        const url = `${baseUrls[ScraperType.NATIVE]}/section/${deptKey}/${courseKey}/${sectionKey}`;
        const sectionSearchResult = await fetch(url).then(res => res.json());
        if (!sectionSearchResult) {
            throw new Error(`'${deptKey} ${courseKey} ${sectionKey}' is not a valid section`);
        }
        sectionSearchResult['session'] = session;
        return sectionSearchResult;
    },
    [ScraperType.UBCCOURSESAPI]: async (deptKey, courseKey, sectionKey, session) => {
        const sectionUrl = `${baseUrls[ScraperType.UBCCOURSESAPI]}/sectioninfo/${deptKey}/${courseKey}/${sectionKey}`;
        try {
            const section = await (await fetch(sectionUrl)).json();
            return {
                ...section,
                session
            }
        } catch (e) {
            throw new Error(`'${deptKey} ${courseKey} ${sectionKey}' is not a valid section`)
        }
    }
}

export default class CourseDataService {
    constructor(scraperType) {
        this.scraperType = scraperType;
    }
    
    async getAllSubjects(payload) {
        const { session } = payload;
        const res = await getAllSubjects[this.scraperType](session);
        return res;
    }

    async searchDept(payload) {
        const { dept, session } = payload;
        const deptKey = formatKey(dept);
        const res = await searchDept[this.scraperType](deptKey, session);
        return res;
    }

    async searchCourse(payload) {
        const { dept, course, session } = payload;
        const deptKey = formatKey(dept);
        const courseKey = formatKey(course);
        const res = await searchCourse[this.scraperType](deptKey, courseKey, session);
        return res;
    }

    async searchSection(payload) {
        const { dept, course, section, session } = payload;
        const deptKey = formatKey(dept);
        const courseKey = formatKey(course);
        const sectionKey = formatKey(section);
        const res = await searchSection[this.scraperType](deptKey, courseKey, sectionKey, session);
        return res;
    }
}

function formatKey(key) {
    return key.toUpperCase().replace(/\s+/g, '');
}