import * as CourseDataService from '../services/course-data.service';

async function getAllDepartments(req, res, next) {
    const result = await CourseDataService.getAllDepartments();
    res.json(result);
}

async function getDepartment(req, res, next) {
    const { dept } = req.params;
    const result = await CourseDataService.getDepartment(dept);
    res.json(result);
}

async function getCoursesByDept(req, res, next) {
    const { dept } = req.params;
    const result = await CourseDataService.getCoursesByDept(dept);
    res.json(result);
}

async function getCourse(req, res, next) {
    const { dept, course } = req.params;
    const result = await CourseDataService.getCourse(dept, course);
    res.json(result);
}

async function getSectionsByCourse(req, res, next) {
    const { dept, course } = req.params;
    const result = await CourseDataService.getSectionsByCourse(dept, course);
    res.json(result);
}

async function getSection(req, res, next) {
    const { dept, course, section } = req.params;
    const result = await CourseDataService.getSection(dept, course, section);
    res.json(result);
}

export default { getAllDepartments, getDepartment, getCoursesByDept, getCourse, getSectionsByCourse, getSection};