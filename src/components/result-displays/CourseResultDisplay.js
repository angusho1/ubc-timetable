import React, { Component } from 'react';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem';

export class CourseResultDisplay extends Component {
    getTitle() {
        const deptObj = this.props.objectOnDisplay;
        const dept = deptObj.subjCode;
        return `${dept} ${this.props.courseKey}`;
    }

    getSubHeading() {
        const courseObj = this.getCourseObj();
        return courseObj.courseTitle;
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
        return this.props.objectOnDisplay.courses[this.props.courseKey];
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

export default CourseResultDisplay
