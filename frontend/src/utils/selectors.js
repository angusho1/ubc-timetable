

// DEPT DISPLAY

export function getDeptTitle(deptObj) {
    return deptObj.title;
}

export function getDeptKey(obj) {
    return obj.subjCode;
}

export function getFacultyName(deptObj) {
    return deptObj.faculty;
}

export function getDeptCourses(deptObj) {
    return deptObj.courses;
}

// COURSE DISPLAY

export function getCourseKey(courseObj) {
    return courseObj.code;
}

export function getCourseTitle(courseObj) {
    return courseObj.title;
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

export function getCourseCode(courseObj) {
    return courseObj.courseCode;
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

export function getSectionHeading(sectionObj) {
    return sectionObj.heading;
}

export function getSectionCourseTitle(sectionObj) {
    return sectionObj.courseTitle;
}

export function getSectionCredits(sectionObj) {
    return sectionObj.credits;
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