import { ScraperType } from "../data/ScraperType";

const baseUrls = {
    [ScraperType.NATIVE]: '/',
    [ScraperType.UBCCOURSESAPI]: 'https://api.ubccourses.com/'
}

const getAllSubjects = {
    [ScraperType.NATIVE]: getDeptListBySession,
    [ScraperType.UBCCOURSESAPI]: () => {}
}

const searchDept = {
    [ScraperType.NATIVE]: searchDeptByKey,
    [ScraperType.UBCCOURSESAPI]: () => {}
}

const searchCourse = {
    [ScraperType.NATIVE]: searchCourseByKey,
    [ScraperType.UBCCOURSESAPI]: () => {}
}

const searchSection = {
    [ScraperType.NATIVE]: searchSectionByKey,
    [ScraperType.UBCCOURSESAPI]: () => {}
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