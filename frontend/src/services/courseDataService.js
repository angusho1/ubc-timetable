import { ScraperType } from "../data/ScraperType";

const baseUrls = {
    [ScraperType.NATIVE]: '',
    [ScraperType.UBCCOURSESAPI]: 'https://api.ubccourses.com'
}

const getAllSubjects = {
    [ScraperType.NATIVE]: getDeptListBySession,
    [ScraperType.UBCCOURSESAPI]: async (session) => {
        const url = `${baseUrls[ScraperType.UBCCOURSESAPI]}/subject`;
        const res = (await (await fetch(url)).json()).subjects;
        return res.filter(subject => subject.hasCourses).map(subject => ({ ...subject, session }));
    }
}

const searchDept = {
    [ScraperType.NATIVE]: searchDeptByKey,
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
    [ScraperType.NATIVE]: searchCourseByKey,
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
    [ScraperType.NATIVE]: searchSectionByKey,
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

async function fetchData() {
    const res = await fetch('/courseData.json')
    return res.json();
}

async function getDeptListBySession(session) {
    const data = await fetchData();
    const courseData = data.departments;
    const deptList = Object.values(courseData)
        .map(dept => { 
            return { subjCode: dept.subjCode,
                    title: dept.title,
                    faculty: dept.faculty,
                    session };
        });
    return deptList;
}

// TODO: Use session in actual search
async function searchDeptByKey(deptKey, session) {
    const data = await fetchData();
    const deptSearchResult = data.departments[deptKey];
            if (!deptSearchResult) {
                throw new Error(`'${deptKey}' is not a valid department`);
            }
            deptSearchResult['session'] = session;
            return deptSearchResult;
}

async function searchCourseByKey(deptKey, courseKey, session) {
    const deptSearchResult = await searchDeptByKey(deptKey, session);
    const courseSearchResult = deptSearchResult.courses[courseKey];
    if (!courseSearchResult) {
        throw new Error(`'${deptKey} ${courseKey}' is not a valid course`);
    }
    courseSearchResult['deptObj'] = copyDeptProperties(deptSearchResult);
    courseSearchResult['session'] = session;
    return courseSearchResult;
}

async function searchSectionByKey(deptKey, courseKey, sectionKey, session) {
    const courseSearchResult = await searchCourseByKey(deptKey, courseKey, session);
    const sectionSearchResult = courseSearchResult.sections[sectionKey];
    if (!sectionSearchResult) {
        throw new Error(`'${deptKey} ${courseKey} ${sectionKey}' is not a valid section`);
    }
    sectionSearchResult['courseObj'] = copyCourseProperties(courseSearchResult);
    sectionSearchResult['session'] = session;
    return sectionSearchResult;
}

function copyDeptProperties(deptObj) {
    let result = {};
    for (let prop in deptObj) {
        if (Object.prototype.hasOwnProperty.call(deptObj, prop) && prop !== 'courses') {
            result[prop] = deptObj[prop];
        }
    }
    return result;
}

function copyCourseProperties(courseObj) {
    let result = {};
    for (let prop in courseObj) {
        if (Object.prototype.hasOwnProperty.call(courseObj, prop) && prop !== 'sections') {
            result[prop] = courseObj[prop];
        }
    }
    return result;
}

function formatKey(key) {
    return key.toUpperCase().replace(/\s+/g, '');
}