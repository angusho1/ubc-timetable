import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem/ResultDisplayItem';
import { searchCourse } from '../../reducers/searchSlice';

export class DeptResultDisplay extends Component {
    getTitle() {
        const obj = this.props.deptObj;
        return `${obj.title} (${obj.subjCode})`;
    }

    getSubHeading() {
        return this.props.deptObj.faculty;
    }

    renderDisplayComponents() {
        return (<div>
            <div>Courses:</div>
            <div className="result-display-item-container">
                { this.renderCourses() }
            </div>
        </div>);
    }

    renderCourses() {
        const courses = Object.values(this.props.deptObj.courses);
        return courses.map((course) => {
            const session = { year: 2020, season: 'W' } // TODO: Remove hardcoded session
            const deptKey = this.props.deptObj.subjCode;
            const courseKey = course.course;
            const courseSearchParams = { dept: deptKey, course: courseKey, session };
            return (<ResultDisplayItem key={course.courseCode}
                                        heading={course.courseCode}
                                        label={course.courseTitle}
                                        onClick={this.props.searchCourse.bind(this, courseSearchParams)} />);
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

export default connect(null, { searchCourse })(DeptResultDisplay);
