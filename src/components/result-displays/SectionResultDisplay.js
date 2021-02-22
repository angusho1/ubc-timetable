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
            { classObjects.map(this.renderClassDisplay) }
        </div>);
    }

    renderInstructorDisplay() {
        const instructors = this.getSectionObj().instructors;
        if (instructors.length > 1) {
            const style = { paddingBottom: '10px'};
            return (
                <div>
                    Instructors:
                    <ul style={style}>
                        {instructors.map(this.renderInstructorName)}
                    </ul>
                </div>
            );
        } else if (instructors.length > 0) {
            return (
                <div>
                    Instructor:
                    <b> {convertName(instructors[0])}</b><br/>
                </div>
            );
        } else {
            return null;
        }
    }

    renderInstructorName(instructor) {
        return (
            <li><b>{convertName(instructor)}</b></li>
        );
    }

    renderAddRemoveButton() {
        return (
            <button className="btn small-btn" onClick={this.props.handleAddRemoveSection}>
                { this.getSectionButtonLabel() }
            </button>
        );
    }

    renderClassDisplay(classObj) {
        const dayString = /\S/.test(classObj.days) ? classObj.days.trim().split(' ').join(' / ') : 'No Schedule';

        const locationInfo = /\S/.test(classObj.location.building) && /\S/.test(classObj.location.room) ? 
            (<div>
                Building: <b> {classObj.location.building}</b>
                <br/>
                Room: <b> {classObj.location.room}</b>
            </div>) : null;

        const termStyle = { float: 'right', fontStyle: 'italic'};

        return (
            <div className="class-div">
                <b>{dayString}</b>
                <span style={termStyle}>TERM {classObj.term}</span>
                <br/>
                Start: <b>{classObj.start}</b>
                <br/>
                End: <b>{classObj.end}</b>
                <br/>
                {locationInfo}
            </div>
        );
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

/** 
 * Converts an instructor's name to regular casing
 * 
 * @returns {string}  the converted name
*/
function convertName(name) {
    if (name == 'TBA') return name;
    let arr = name.split(', ');
    let lastName = arr[0];
    let firstName = arr[1];

    const titleRegex = /\([A-Za-z]+\)/;
    if (titleRegex.test(firstName)) {
        const title = firstName.match(titleRegex);
        firstName = firstName.replace(titleRegex, '')
        firstName = lowerLetters(firstName);
        lastName = lowerLetters(lastName);
        lastName += ` ${title}`;
    } else {
        firstName = lowerLetters(firstName);
        lastName = lowerLetters(lastName);
    }

    let result = `${firstName} ${lastName}`;
    console.log(result);
    return result;
}

function lowerLetters(name) {
    let arr = name.split(' ');
    let converted = [];

    arr.forEach(str => {
        if (/-/.test(str)) {
            let dashedName = str.split('-');
            str = dashedName[0].charAt(0) + dashedName[0].slice(1).toLowerCase() + '-' +
            dashedName[1].charAt(0) + dashedName[1].slice(1).toLowerCase();
            converted.push(str);
        } else {
            converted.push(str.charAt(0) + str.slice(1).toLowerCase());
        }
    });
    return converted.join(' ');
}

export default SectionResultDisplay;
