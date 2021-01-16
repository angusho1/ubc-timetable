import React, { Component } from 'react'
import ResultDisplay from './ResultDisplay'

export class CourseResultDisplay extends Component {
    getTitle() {
        // const deptObj = this.props.objectOnDisplay;
        // const courseObj = 
        // return `${obj.title} ${obj.subjCode}`;
    }

    getSubHeading() {
        return this.props.objectOnDisplay.faculty;
    }

    renderDisplayComponents() {
        return (<div></div>);
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
