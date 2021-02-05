import React, { Component } from 'react';
import { SearchType } from '../data/SearchType';
import SearchForm from './search/SearchForm';
import TimetableControl from './timetable/TimetableControl';
import DeptResultDisplay from './result-displays/DeptResultDisplay';
import CourseResultDisplay from './result-displays/CourseResultDisplay';
import SectionResultDisplay from './result-displays/SectionResultDisplay';
import { connect } from 'react-redux';
import { addSection, removeSection } from '../reducers/timetableSlice';

export class AppControl extends Component {
    timetableControl = null;

    constructor(props) {
        super(props);
        this.state = {
            addedSections: [],
            objectOnDisplay: null,
            typeObjectOnDisplay: null,
            currentCourseKey: null,
            currentSectionKey: null
        }

        this.coursesData = null;
        this.buildingData = null;
    }

    searchDept(dept) {
        console.log(`Department Search: ${dept}`);
        // todo: Search

        this.fetchDept(dept)
            .then((res) => {
                console.log(res);
                this.setState({
                    objectOnDisplay: res,
                    typeObjectOnDisplay: SearchType.DEPT
                });
            })
            .catch((e) => {
                this.handleDeptSearchFail(dept, e);
            });
    }

    searchCourse(dept, course) {
        console.log(`Course Search: ${dept} ${course}`);

        this.fetchCourse(dept, course)
        .then((res) => {
            console.log(res);
            this.setState({
                objectOnDisplay: res,
                typeObjectOnDisplay: SearchType.COURSE,
                currentCourseKey: course
            });
        })
        .catch((e) => {
            this.handleCourseSearchFail(course, e);
        });
    }

    searchSection(dept, course, section) {
        console.log(`Section Search: ${dept} ${course} ${section}`);

        this.fetchSection(dept, course, section)
        .then((res) => {
            console.log(res);
            this.setState({
                objectOnDisplay: res,
                typeObjectOnDisplay: SearchType.SECTION,
                currentCourseKey: course,
                currentSectionKey: section
            });
        })
        .catch((e) => {
            this.handleSectionSearchFail(course, e);
        });
    }

    async temporaryFetch() {

        await fetch('/courseData.json') 
            // .then(res => console.log(res));
            .then(res => res.json())
            .then(data => {
                this.coursesData = data;
                // console.log(data);
            });

        await fetch('/buildings.json')
            .then(res => res.json())
            .then(data => {
                this.buildingData = data;
                // console.log(data);
            });
    }

    async fetchDept(dept) {
        const searchkey = formatKey(dept);
        if (!this.coursesData) {
            await this.temporaryFetch();
        }
        const deptSearchResult = this.coursesData.departments[searchkey];
        if (!deptSearchResult) {
            throw new Error(`${dept} is not a valid department`);
        }
        return Promise.resolve(deptSearchResult);
    }

    async fetchCourse(dept, course) {
        const deptKey = formatKey(dept);
        const courseKey = formatKey(course);
        if (!this.coursesData) {
            await this.temporaryFetch();
        }
        const deptSearchResult = this.coursesData.departments[deptKey];
        if (!deptSearchResult) {
            throw new Error(`${dept} is not a valid department`);
        }
        const courseSearchResult = deptSearchResult.courses[courseKey];
        if (!courseSearchResult) {
            throw new Error(`${dept} ${course} is not a valid course`);
        }
        return Promise.resolve(deptSearchResult);
    }

    async fetchSection(dept, course, section) {
        const deptKey = formatKey(dept);
        const courseKey = formatKey(course);
        const sectionKey = formatKey(section);

        if (!this.coursesData) {
            await this.temporaryFetch();
        }
        const deptSearchResult = this.coursesData.departments[deptKey];
        if (!deptSearchResult) {
            throw new Error(`${dept} is not a valid department`);
        }
        const courseSearchResult = deptSearchResult.courses[courseKey];
        if (!courseSearchResult) {
            throw new Error(`${dept} ${course} is not a valid course`);
        }
        const sectionSearchResult = courseSearchResult.sections[sectionKey];
        if (!sectionSearchResult) {
            throw new Error(`${dept} ${course} ${section} is not a valid section`);
        }
        return Promise.resolve(deptSearchResult);
    }

    handleDeptSearchFail(dept, e) {
        console.log(e.message);
    }

    handleCourseSearchFail(course, e) {
        console.log(e.message);
    }

    handleSectionSearchFail(section, e) {
        console.log(e.message);
    }

    handleAddRemoveSection = () => {
        if (this.isSectionAdded()) {
            
        } else {
            // this.timetableControl.addSection('table1', this.state.objectOnDisplay, this.state.currentCourseKey, this.state.currentSectionKey);
            this.props.addSection({
                tableKey: 'table1',
                deptObj: this.state.objectOnDisplay,
                course: this.state.currentCourseKey,
                section: this.state.currentSectionKey
            });
        }
    }

    isSectionAdded = () => {
        const sectionCode = this.getCurrentSectionCode();
        return this.state.addedSections.includes(sectionCode);
    }

    getCurrentSectionCode() {
        const deptKey = this.state.objectOnDisplay.subjCode;
        return `${deptKey} ${this.state.currentCourseKey} ${this.state.currentSectionKey}`;
    }

    renderResultDisplay() {
        const type = this.state.typeObjectOnDisplay;
        const objectOnDisplay = this.state.objectOnDisplay;
        if (type === SearchType.DEPT) {
            return (<DeptResultDisplay objectOnDisplay={objectOnDisplay} />);
        } else if (type === SearchType.COURSE) {
            return (<CourseResultDisplay objectOnDisplay={objectOnDisplay}
                                        courseKey={this.state.currentCourseKey} />);
        } else if (type === SearchType.SECTION) {
            return (<SectionResultDisplay objectOnDisplay={objectOnDisplay}
                                        courseKey={this.state.currentCourseKey}
                                        sectionKey={this.state.currentSectionKey}
                                        handleAddRemoveSection={this.handleAddRemoveSection}
                                        isSectionAdded={this.isSectionAdded()} />);
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="container">   
                <div className="search-wrapper">
                    <SearchForm searchDept={this.searchDept.bind(this)}
                                searchCourse={this.searchCourse.bind(this)}
                                searchSection={this.searchSection.bind(this)}
                                />
                    {this.renderResultDisplay()}
                </div>
                <TimetableControl />
            </div>
        )
    }
}

function formatKey(key) {
    return key.toUpperCase().replace(/\s+/g, '');
}

const mapDispatch = dispatch => {
    return {
        addSection: dispatch(addSection()),
        removeSection: dispatch(removeSection()),
    }
}

export default connect(null, { addSection, removeSection })(AppControl);