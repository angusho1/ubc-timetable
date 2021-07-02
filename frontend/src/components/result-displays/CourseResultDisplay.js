import React, { useContext } from 'react';
import { connect } from 'react-redux';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem/ResultDisplayItem';
import { searchSection, searchCourse } from '../../reducers/searchSlice';
import { getCourseDeptKey, getCourseKey, getCourseTitle, getCourseCredits, getCoursePreReqs, getCourseSections, getSectionKey } from '../../utils/selectors.js';
import { ScraperContext } from '../AppControl';
import parse, { attributesToProps } from 'html-react-parser';

export function CourseResultDisplay(props) {
    const scraperType = useContext(ScraperContext);
    const courseCodeRegex = /[A-Z]{2,4}\s[A-Z0-9]{3,4}/g;
    const session = { year: 2021, season: 'W' } // TODO: Remove hardcoded session

    function getTitle() {
        const courseObj = getCourseObj();
        return `${getCourseDeptKey(courseObj)} ${getCourseKey(courseObj)}`;
    }

    function getSubHeading() {
        return getCourseTitle(getCourseObj());
    }

    function renderDisplayComponents() {
        const courseObj = getCourseObj();
        return (<div>
            <div>Credits: <b>{getCourseCredits(courseObj)}</b></div>
            <div>Pre-Reqs: {displayPreReqs(courseObj)}</div>
            <div>Sections:</div>
            <div className="list-group result-display-item-container">
                { renderSections() }
            </div>
        </div>);
    }

    function renderSections() {
        const courseObj = getCourseObj();
        const sections = Object.values(getCourseSections(courseObj));
        return sections.map((section) => {
            const deptKey = getCourseDeptKey(courseObj);
            const courseKey = getCourseKey(courseObj);
            const sectionKey = getSectionKey(section);
            const sectionSearchParams = { dept: deptKey, course: courseKey, section: sectionKey, session, scraperType };
            return (<ResultDisplayItem key={section.sectionCode}
                                        heading={section.sectionCode}
                                        label={section.activity}
                                        onClick={() => props.searchSection(sectionSearchParams)} />);
        });
    }

    function getCourseObj() {
        return props.courseObj;
    }

    function displayPreReqs(courseObj) {
        const prereqs = getCoursePreReqs(courseObj);
        const courses = prereqs.matchAll(courseCodeRegex);
        let currCourse = courses.next();
        let res = prereqs;
        while (typeof currCourse.value !== 'undefined') {
            const courseStr = currCourse.value[0];
            res = res.replace(courseStr, `<span class="badge bg-primary" coursestr="${courseStr}"></span>`);
            currCourse = courses.next();
        }
        const options = {
            replace: domNode => {
                if (domNode.attribs && domNode.name === 'span') {
                    console.log(domNode);
                    const elemProps = attributesToProps(domNode.attribs);
                    const courseSplit = elemProps.coursestr.split(' ');
                    const dept = courseSplit[0];
                    const course = courseSplit[1];
                    const courseSearchParams = { dept, course, session, scraperType };
                    elemProps.onClick = () => props.searchCourse(courseSearchParams);
                    return <span {...elemProps}>{elemProps.coursestr}</span>;
                }
            }
        }

        return parse(res, options);
    }

    return (
        <ResultDisplay  title={getTitle()}
                        subHeading={getSubHeading()}>
            {renderDisplayComponents()}
        </ResultDisplay>
    )
}

export default connect(null, { searchSection, searchCourse })(CourseResultDisplay);