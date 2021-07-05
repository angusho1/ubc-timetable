import express from 'express';
import CourseDataController from "../controllers/course-data.controller";

const router = express.Router();

router.get('/departments', CourseDataController.getAllDepartments);

router.get('/department/:dept', CourseDataController.getDepartment);
router.get('/courses/:dept', CourseDataController.getCoursesByDept);

router.get('/course/:dept/:course', CourseDataController.getCourse);
router.get('/sections/:dept/:course', CourseDataController.getSectionsByCourse);

router.get('/section/:dept/:course/:section', CourseDataController.getSection);

export default router;