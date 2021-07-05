import fetch from 'node-fetch';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const baseUrl = 'https://courses.students.ubc.ca/cs/courseschedule';

export async function getAllDepartments() {
    console.log('Getting all departments');
    const url = `${baseUrl}?pname=subjarea&tname=subj-all-departments`;
    const html = await fetch(url).then(res => res.text());
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const tbody = document.querySelector('#mainTable tbody');
    const res = { departments: [] }

    for (let row of tbody.children) {
        let subjCode = row.children[0].textContent;
        const subjTitle = row.children[1].textContent.trim();
        const faculty = row.children[2].textContent;

        const noCourses = /\s\*/;
        if (noCourses.test(subjCode)) {
            subjCode = subjCode.replace(" \*", "");
        }

        let rowData = {
            "subjCode" : subjCode,
            "title" : subjTitle,
            "faculty" : faculty,
        };
        
        res.departments[subjCode] = rowData;
    }

    return res;
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