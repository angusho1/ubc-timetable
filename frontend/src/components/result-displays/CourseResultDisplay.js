import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem/ResultDisplayItem';
import { searchSection } from '../../reducers/searchSlice';

export class CourseResultDisplay extends Component {
    getTitle() {
        const courseObj = this.getCourseObj();
        return `${getDeptKey(courseObj)} ${getCourseKey(courseObj)}`;
    }

    getSubHeading() {
        return getCourseTitle(this.getCourseObj());
    }

    renderDisplayComponents() {
        const courseObj = this.getCourseObj();
        return (<div>
            <div>Credits: <b>{getCourseCredits(courseObj)}</b></div>
            <div>Pre-Reqs: <b>{getCoursePreReqs(courseObj)}</b></div>
            <div>Sections:</div>
            <div className="list-group result-display-item-container">
                { this.renderSections() }
            </div>
        </div>);
    }

    renderSections() {
        const courseObj = this.getCourseObj();
        const sections = Object.values(getCourseSections(courseObj));
        return sections.map((section) => {
            const session = { year: 2021, season: 'W' } // TODO: Remove hardcoded session
            const deptKey = getDeptKey(courseObj);
            const courseKey = getCourseKey(courseObj);
            const sectionKey = getSectionKey(section);
            const sectionSearchParams = { dept: deptKey, course: courseKey, section: sectionKey, session };
            return (<ResultDisplayItem key={section.sectionCode}
                                        heading={section.sectionCode}
                                        label={section.activity}
                                        onClick={this.props.searchSection.bind(this, sectionSearchParams)} />);
        });
    }

    getCourseObj() {
        return this.props.courseObj;
    }

    render() {
        return (
            <ResultDisplay  title={this.getTitle()}
                            subHeading={this.getSubHeading()}>
                {this.renderDisplayComponents()}
            </ResultDisplay>
        )
    }
}

function getCourseTitle(courseObj) {
    return courseObj.courseTitle;
}

function getCourseCredits(courseObj) {
    return courseObj.credits;
}

function getCoursePreReqs(courseObj) {
    return courseObj.prereqs;
}

function getCourseSections(courseObj) {
    return courseObj.sections;
}

function getDeptKey(courseObj) {
    return courseObj.deptObj.subjCode;
}

function getCourseKey(courseObj) {
    return courseObj.course;
}

function getSectionKey(sectionObj) {
    return sectionObj.section;
}

export default connect(null, { searchSection })(CourseResultDisplay);