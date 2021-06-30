import React, { useContext } from 'react';
import { connect } from 'react-redux';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem/ResultDisplayItem';
import { searchCourse } from '../../reducers/searchSlice';
import { getDeptTitle, getDeptKey, getFacultyName, getDeptCourses, getCourseKey } from '../../utils/selectors.js';
import { ScraperContext } from '../AppControl';

export function DeptResultDisplay(props) {
    const scraperType = useContext(ScraperContext);

    function getTitle() {
        const deptObj = getDeptObj();
        return `${getDeptTitle(deptObj)} (${getDeptKey(deptObj)})`;
    }

    function getSubHeading() {
        return getFacultyName(getDeptObj());
    }

    function renderDisplayComponents() {
        return (<div>
            <div>Courses:</div>
            <div className="list-group result-display-item-container">
                { renderCourses() }
            </div>
        </div>);
    }

    function renderCourses() {
        const deptObj = getDeptObj();
        const courses = Object.values(getDeptCourses(deptObj));
        return courses.map((course) => {
            const session = { year: 2021, season: 'W' } // TODO: Remove hardcoded session
            const deptKey = getDeptKey(deptObj);
            const courseKey = getCourseKey(course);
            const courseSearchParams = { dept: deptKey, course: courseKey, session, scraperType };
            return (<ResultDisplayItem key={course.courseCode}
                                        heading={course.courseCode}
                                        label={course.courseTitle}
                                        onClick={() => props.searchCourse(courseSearchParams)} />);
        });
        
    }

    function getDeptObj() {
        return props.deptObj;
    }

    return (
        <ResultDisplay  title={getTitle()}
                        subHeading={getSubHeading()}>
            {renderDisplayComponents()}
        </ResultDisplay>
    )
}

export default connect(null, { searchCourse })(DeptResultDisplay);
