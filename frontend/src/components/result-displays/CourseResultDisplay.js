import React, { useContext } from 'react';
import { connect } from 'react-redux';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem/ResultDisplayItem';
import { searchSection } from '../../reducers/searchSlice';
import { getCourseDeptKey, getCourseKey, getCourseTitle, getCourseCredits, getCoursePreReqs, getCourseSections, getSectionKey } from '../../utils/selectors.js';
import { ScraperContext } from '../AppControl';

export function CourseResultDisplay(props) {
    const scraperType = useContext(ScraperContext);

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
            <div>Pre-Reqs: <b>{getCoursePreReqs(courseObj)}</b></div>
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
            const session = { year: 2021, season: 'W' } // TODO: Remove hardcoded session
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

    return (
        <ResultDisplay  title={getTitle()}
                        subHeading={getSubHeading()}>
            {renderDisplayComponents()}
        </ResultDisplay>
    )
}

export default connect(null, { searchSection })(CourseResultDisplay);