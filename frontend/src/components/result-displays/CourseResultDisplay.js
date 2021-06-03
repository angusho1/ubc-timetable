import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem/ResultDisplayItem';
import { searchSection } from '../../reducers/searchSlice';

export class CourseResultDisplay extends Component {
    getTitle() {
        const courseObj = this.getCourseObj();
        const dept = courseObj.deptObj.subjCode;
        return `${dept} ${courseObj.course}`;
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
            <div className="list-group result-display-item-container">
                { this.renderSections() }
            </div>
        </div>);
    }

    renderSections() {
        const courseObj = this.getCourseObj();
        const sections = Object.values(courseObj.sections);
        return sections.map((section) => {
            const session = { year: 2020, season: 'W' } // TODO: Remove hardcoded session
            const deptKey = courseObj.deptObj.subjCode;
            const courseKey = courseObj.course;
            const sectionKey = section.section;
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

export default connect(null, { searchSection })(CourseResultDisplay);