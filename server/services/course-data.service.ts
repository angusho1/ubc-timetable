const baseUrl = 'https://courses.students.ubc.ca/cs/courseschedule';

export async function getAllDepartments() {
    console.log('Getting all departments');
    const url = `${baseUrl}?pname=subjarea&tname=subj-all-departments`;
    return { url };
}

export async function getDepartment(dept) {
    console.log(`Getting department '${dept}'`)
    const url = `${baseUrl}?pname=subjarea&tname=subj-department&dept=${dept}`;
    return { url };
}

export async function getCoursesByDept(dept) {
    console.log(`Getting courses for department '${dept}'`);
    const url = `${baseUrl}?pname=subjarea&tname=subj-department&dept=${dept}`;
    return { url };
}

export async function getCourse(dept, course) {
    console.log(`Getting course '${dept} ${course}'`);
    const url = `${baseUrl}?pname=subjarea&tname=subj-course&dept=${dept}&course=${course}`;
    return { url };
}

export async function getSectionsByCourse(dept, course) {
    console.log(`Getting sections from course '${dept} ${course}'`);
    const url = `${baseUrl}?pname=subjarea&tname=subj-course&dept=${dept}&course=${course}`;
    return { url };
}

export async function getSection(dept, course, section) {
    console.log(`Getting section '${dept} ${course} ${section}'`);
    const url = `${baseUrl}?pname=subjarea&tname=subj-section&dept=${dept}&course=${course}&section=${section}`;
    return { url };
}