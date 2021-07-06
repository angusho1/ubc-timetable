import fetch from 'node-fetch';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const baseUrl = 'https://courses.students.ubc.ca/cs/courseschedule';
const headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Ch-Ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "X-Amzn-Trace-Id": "Root=1-60e29bb1-5f75f18a6687c9bd4f00bcc3"
}

export async function getAllDepartments() {
    console.log('Getting all departments');
    const url = `${baseUrl}?pname=subjarea&tname=subj-all-departments`;
    const document = await fetchPageDoc(url);
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
        
        res.departments.push(rowData);
    }

    return res;
}

export async function getDepartment(dept) {
    console.log(`Getting department '${dept}'`);
    const url = `${baseUrl}?pname=subjarea&tname=subj-department&dept=${dept}`;
    return { url };
}

export async function getCoursesByDept(dept) {
    console.log(`Getting courses for department '${dept}'`);
    const url = `${baseUrl}?pname=subjarea&tname=subj-department&dept=${dept}`;
    const document = await fetchPageDoc(url);
    const tbody = document.querySelector('#mainTable tbody');

    const res = { courses: [] };

    if (tbody != null) {
        for (let row of tbody.children) {
            const courseCode = row.children[0].textContent.trim();
            const code = courseCode.split(' ')[1];
            const courseTitle = row.children[1].textContent;

            res.courses.push({ "courseCode" : courseCode, "courseTitle": courseTitle, "code" : code });
        }
    }
    return res;
}

export async function getCourse(dept, course) {
    console.log(`Getting course '${dept} ${course}'`);
    const url = `${baseUrl}?pname=subjarea&tname=subj-course&dept=${dept}&course=${course}`;
    const courseCodeRegex = /[A-Z]{2,4}\s[A-Z0-9]{3,4}/;
    const document = await fetchPageDoc(url);
    const tbody = document.querySelector('.section-summary tbody');
    const description = document.querySelector('.content.expand p').textContent;
    const heading = document.querySelector('.content.expand h4').textContent;
    const pTags = document.querySelectorAll('p');
    const credits = parseInt(pTags[1].textContent.replace("Credits: ", "").trim());
    const title = heading.replace(courseCodeRegex, '').trim();
    let preReqs = "";
    let coReqs = "";

    if (pTags[2] != null && /Pre-reqs:/.test(pTags[2].textContent)) {
        preReqs = pTags[2].textContent.replace("Pre-reqs:", "").trim();
    }

    if (pTags[3] != null && /Co-reqs:/.test(pTags[3].textContent)) {
        coReqs = pTags[3].textContent.replace("Co-reqs:", "").trim();
    }

    const res = { sections: [] };
    
    res["subjCode"] = dept.toUpperCase();
    res["code"] = course.toUpperCase();
    res['title'] = title;
    res["courseCode"] = `${dept.toUpperCase()} ${course.toUpperCase()}`
    res["description"] = description;
    res["credits"] = credits;
    res["prereqs"] = preReqs;
    res["coreqs"] = coReqs;

    if (tbody != null) {
        for (let row of tbody.children) {
            let status = row.children[0].textContent;
            let sectionCode = row.children[1].textContent;
            let section = sectionCode.split(' ')[2];
            const activity = row.children[2].textContent;
            const term = row.children[3].textContent;
            const mode = row.children[4].textContent;

            let rowData = {
                status,
                sectionCode,
                section,
                activity,
                term,
                mode
            };

            res.sections.push(rowData);
        }
    }
    return res;
}

export async function getSectionsByCourse(dept, course) {
    console.log(`Getting sections from course '${dept} ${course}'`);
    const url = `${baseUrl}?pname=subjarea&tname=subj-course&dept=${dept}&course=${course}`;
    return { url };
}

export async function getSection(dept, course, section) {
    console.log(`Getting section '${dept} ${course} ${section}'`);
    const url = `${baseUrl}?pname=subjarea&tname=subj-section&dept=${dept}&course=${course}&section=${section}`;
    const document = await fetchPageDoc(url);
    const heading = document.querySelector('.content.expand h4').textContent;
    const sectionCode = `${dept.toUpperCase()} ${course.toUpperCase()} ${section.toUpperCase()}`;
    const activity = heading.split('(')[1].split(')')[0];
    const courseTitle = document.querySelector('.content.expand h5').textContent;
    const credits = parseInt(document.querySelectorAll('p')[1].textContent.replace("Credits: ", "").trim());

    const sectionInfo = document.querySelector('.table-striped tbody');

    let classes = [];
    if (sectionInfo != null && sectionInfo.firstElementChild.children.length == 6) {
        for (let row of sectionInfo.children) {
            if (row.children.length == 6) {
                let term = row.children[0].textContent;
                let days = row.children[1].textContent;
                let start = row.children[2].textContent;
                let end = row.children[3].textContent;
                let building = row.children[4].textContent;
                let room = row.children[5].textContent;
                let buildingInfoLink;
                if (/\S/.test(room) && row.children[5].firstElementChild) {
                    buildingInfoLink = row.children[5].firstElementChild.href;
                }
    
                classes.push({
                    term,
                    days,
                    start,
                    end,
                    "location" : {
                        building,
                        room
                    }
                });
            }
        }
    }

    let instructors = [];
    document.querySelectorAll('tr').forEach(tr => {
        if (/Instructor:/.test(tr.firstElementChild.textContent)) {
            for (let row of tr.parentElement.children) {
                instructors.push(row.children[1].textContent);
            }
        }
    });

    let totalSeatsRem;
    let currentReg;
    let generalSeatsRem;
    let restrictedSeatsRem;
    document.querySelectorAll('th').forEach(th => {
        if (/Seat Summary/.test(th.textContent)) {
            const tbody = th.parentElement.parentElement.parentElement.lastElementChild;
            
            for (let tr of tbody.children) {
                if (/Total Seats Remaining:/.test(tr.textContent)) {
                    totalSeatsRem = parseInt(tr.lastElementChild.textContent);
                }
                if (/Currently Registered/.test(tr.textContent)) {
                    currentReg =  parseInt(tr.lastElementChild.textContent);
                }
                if (/General Seats Remaining/.test(tr.textContent)) {
                    generalSeatsRem = parseInt(tr.lastElementChild.textContent);
                }
                if (/Restricted Seats/.test(tr.textContent)) {
                    restrictedSeatsRem = parseInt(tr.lastElementChild.textContent);
                }
            }
        }
    });

    const res = {
        heading,
        sectionCode,
        activity,
        courseTitle,
        credits,
        totalSeatsRem,
        currentReg,
        generalSeatsRem,
        restrictedSeatsRem,
        instructors,
        classes
    }

    return res;
}

async function fetchPageDoc(url) {
    const html = await fetch(url, { headers }).then(res => res.text());
    const dom = new JSDOM(html);
    return dom.window.document;
}