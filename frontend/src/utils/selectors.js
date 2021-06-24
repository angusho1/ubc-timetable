

// DEPT DISPLAY

export function getDeptTitle(deptObj) {
    return deptObj.title;
}

export function getDeptKey(deptObj) {
    return deptObj.subjCode;
}

export function getFacultyName(deptObj) {
    return deptObj.faculty;
}

export function getDeptCourses(deptObj) {
    return deptObj.courses;
}

// COURSE DISPLAY

export function getCourseKey(courseObj) {
    return courseObj.course;
}

export function getCourseTitle(courseObj) {
    return courseObj.courseTitle;
}

export function getCourseCredits(courseObj) {
    return courseObj.credits;
}

export function getCoursePreReqs(courseObj) {
    return courseObj.prereqs;
}

export function getCourseSections(courseObj) {
    return courseObj.sections;
}

export function getCourseDeptKey(courseObj) {
    return courseObj.deptObj.subjCode;
}

export function getSectionKey(sectionObj) {
    return sectionObj.section;
}

// SECTION DISPLAY

export function getSectionCode(sectionObj) {
    return sectionObj.sectionCode;
}

export function getSectionActivity(sectionObj) {
    return sectionObj.activity;
}

export function getCredits(sectionObj) {
    return sectionObj.courseObj.credits;
}

export function getSectionClasses(sectionObj) {
    return sectionObj.classes;
}

export function getSectionTotalSeatsRemaining(sectionObj) {
    return sectionObj.totalSeatsRem;
}

export function getSectionInstructors(sectionObj) {
    return sectionObj.instructors;
}