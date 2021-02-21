import React, { Component } from 'react';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem';

export class SectionResultDisplay extends Component {
    getTitle() {
        const sectionObj = this.getSectionObj();
        const sectionCode = sectionObj.sectionCode;
        const activity = sectionObj.activity;
        return `${sectionCode} (${activity})`;
    }

    getSubHeading() {
        const courseObj = this.getCourseObj();
        return courseObj.courseTitle;
    }

    renderDisplayComponents() {
        const courseObj = this.getCourseObj();
        const sectionObj = this.getSectionObj();
        const classObjects = sectionObj.classes;
        return (<div>
            { this.renderInstructorDisplay() }
            <p>Credits: <b>{courseObj.credits}</b></p>
            <p>Total Seats Remaining: <b>{sectionObj.totalSeatsRem}</b></p>
            { this.renderAddRemoveButton() }
            { this.renderClassDisplays(classObjects) }
        </div>);
    }

    renderInstructorDisplay() {
        // TODO
    }

    renderAddRemoveButton() {
        return (
            <button className="btn small-btn" onClick={this.props.handleAddRemoveSection}>
                { this.getSectionButtonLabel() }
            </button>
        );
    }

    renderClassDisplays(classObjects) {
        // TODO
    }

    getSectionButtonLabel() {
        return this.props.isSectionAdded ? '- Remove Section' : '+ Add Section';
    }

    getCourseObj() {
        return this.props.sectionObj.courseObj;
    }

    getSectionObj() {
        return this.props.sectionObj;
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

export default SectionResultDisplay;
