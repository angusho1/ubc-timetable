import { ScraperType } from "../data/ScraperType";

const baseUrls = {
    [ScraperType.NATIVE]: '/',
    [ScraperType.UBCCOURSESAPI]: 'https://api.ubccourses.com/'
}

const getAllSubjects = {
    [ScraperType.NATIVE]: () => {},
    [ScraperType.UBCCOURSESAPI]: () => {}
}

const searchDept = {
    [ScraperType.NATIVE]: () => {},
    [ScraperType.UBCCOURSESAPI]: () => {}
}

const searchCourse = {
    [ScraperType.NATIVE]: () => {},
    [ScraperType.UBCCOURSESAPI]: () => {}
}

const searchSection = {
    [ScraperType.NATIVE]: () => {},
    [ScraperType.UBCCOURSESAPI]: () => {}
}

class CourseDataService {
    // TODO: Transfer searchSlice methods to this service
    
    getAllSubjects(payload, scraperType) {
        const url =  baseUrls[scraperType];
        return getAllSubjects[scraperType](payload, url);
    }

    searchDept(payload, scraperType) {
        const url =  baseUrls[scraperType];
        return searchDept[scraperType](payload, url);
    }

    searchCourse(payload, scraperType) {
        const url =  baseUrls[scraperType];
        return searchCourse[scraperType](payload, url);
    }

    searchSection(payload, scraperType) {
        const url =  baseUrls[scraperType];
        return searchSection[scraperType](payload, url);
    }

    _getAllSubjectsUrl() {

    }

    _searchDeptUrl() {

    }

    _searchCourseUrl() {

    }

    _searchSectionUrl() {

    }
}

export default CourseDataService = new CourseDataService();