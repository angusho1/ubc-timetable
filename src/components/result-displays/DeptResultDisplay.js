import React, { Component } from 'react';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem';

export class DeptResultDisplay extends Component {
    getTitle() {
        const obj = this.props.objectOnDisplay;
        return `${obj.title} (${obj.subjCode})`;
    }

    getSubHeading() {
        return this.props.objectOnDisplay.faculty;
    }

    renderDisplayComponents() {
        return (<div>
            <p>Courses:</p>
            { this.renderCourses() }
        </div>);
    }

    renderCourses() {
        const courses = Object.values(this.props.objectOnDisplay.courses);
        return courses.map((course) => {
            return (<ResultDisplayItem key={course.courseCode}
                                        heading={course.courseCode}
                                        label={course.courseTitle} />);
        });
        
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

export default DeptResultDisplay;
