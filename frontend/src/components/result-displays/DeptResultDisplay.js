import React, { Component } from 'react';
import { connect } from 'react-redux';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem/ResultDisplayItem';
import { searchCourse } from '../../reducers/searchSlice';

export class DeptResultDisplay extends Component {
    getTitle() {
        const deptObj = this.getDeptObj();
        return `${getDeptTitle(deptObj)} (${getDeptKey(deptObj)})`;
    }

    getSubHeading() {
        return getFacultyName(this.getDeptObj());
    }

    renderDisplayComponents() {
        return (<div>
            <div>Courses:</div>
            <div className="list-group result-display-item-container">
                { this.renderCourses() }
            </div>
        </div>);
    }

    renderCourses() {
        const deptObj = this.getDeptObj();
        const courses = Object.values(getDeptCourses(deptObj));
        return courses.map((course) => {
            const session = { year: 2020, season: 'W' } // TODO: Remove hardcoded session
            const deptKey = getDeptKey(deptObj);
            const courseKey = getCourseKey(course);
            const courseSearchParams = { dept: deptKey, course: courseKey, session };
            return (<ResultDisplayItem key={course.courseCode}
                                        heading={course.courseCode}
                                        label={course.courseTitle}
                                        onClick={this.props.searchCourse.bind(this, courseSearchParams)} />);
        });
        
    }

    getDeptObj() {
        return this.props.deptObj;
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

function getDeptTitle(deptObj) {
    return deptObj.title;
}

function getDeptKey(deptObj) {
    return deptObj.subjCode;
}

function getFacultyName(deptObj) {
    return deptObj.faculty;
}

function getDeptCourses(deptObj) {
    return deptObj.courses;
}

function getCourseKey(courseObj) {
    return courseObj.course;
}

export default connect(null, { searchCourse })(DeptResultDisplay);
