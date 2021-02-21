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

    handleAddRemoveSection = () => {
        if (this.isSectionAdded()) {
            
        } else {
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
                    <SearchForm 
                                // searchDept={this.searchDept.bind(this)}
                                // searchCourse={this.searchCourse.bind(this)}
                                // searchSection={this.searchSection.bind(this)}
                                />
                    {this.renderResultDisplay()}
                </div>
                <TimetableControl />
            </div>
        )
    }
}

export default connect(null, { addSection, removeSection })(AppControl);