import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem';

export class CourseResultDisplay extends Component {
    getTitle() {
        const courseObj = this.getCourseObj();
        const dept = courseObj.deptObj.subjCode;
        return `${dept} ${this.props.courseKey}`;
    }

    getSubHeading() {
        return this.props.courseObj.courseTitle;
    }

    renderDisplayComponents() {
        const courseObj = this.getCourseObj();
        return (<div>
            <p>Credits: <b>{courseObj.credits}</b></p>
            <p>Pre-Reqs: <b>{courseObj.prereqs}</b></p>
            <p>Sections:</p>
            { this.renderSections() }
        </div>);
    }

    renderSections() {
        const courseObj = this.getCourseObj();
        const sections = Object.values(courseObj.sections);
        return sections.map((section) => {
            return (<ResultDisplayItem key={section.sectionCode}
                                        heading={section.sectionCode}
                                        label={section.activity} />);
        });
    }

    getCourseObj() {
        return this.props.courseObj;
        // return this.props.objectOnDisplay.courses[this.props.courseKey];
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

const mapState = state => ({
    courseObj: state.search.objectOnDisplay,
    currentCourseKey: state.search.currentCourseKey,
    currentSectionKey: state.search.currentSectionkey
});

export default connect(mapState)(CourseResultDisplay);