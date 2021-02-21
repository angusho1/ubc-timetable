import React, { Component } from 'react';
import { SearchType } from '../data/SearchType';
import SearchForm from './search/SearchForm';
import TimetableControl from './timetable/TimetableControl';
import DeptResultDisplay from './result-displays/DeptResultDisplay';
import CourseResultDisplay from './result-displays/CourseResultDisplay';
import SectionResultDisplay from './result-displays/SectionResultDisplay';
import ErrorDisplay from './result-displays/ErrorDisplay';
import { connect } from 'react-redux';
import { addSection, removeSection } from '../reducers/timetableSlice';

export class AppControl extends Component {

    handleAddRemoveSection = () => {
        if (this.isSectionAdded()) {
            
        } else {
            this.props.addSection({
                tableKey: 'table1',
                sectionObj: this.props.objectOnDisplay
            });
        }
    }

    isSectionAdded = () => {
        const sectionCode = this.getCurrentSectionCode();
        return this.props.addedSections.includes(sectionCode);
    }

    getCurrentSectionCode() {
        if (this.props.typeObjectOnDisplay !== SearchType.SECTION) {
            throw new Error("The current object on display is not a section");
        }
        const sectionObj = this.props.objectOnDisplay;
        const deptKey = sectionObj.courseObj.deptObj.subjCode;
        const courseKey = sectionObj.courseObj.course;
        const sectionKey = sectionObj.section;
        return `${deptKey} ${courseKey} ${sectionKey}`;
    }

    renderResultDisplay() {
        const type = this.props.typeObjectOnDisplay;
        const objectOnDisplay = this.props.objectOnDisplay;
        if (this.props.status == 'pending' || this.props.status == 'idle') return null;
        if (this.props.status == 'failed') return this.failedDisplay();
        if (type === SearchType.DEPT) {
            return (<DeptResultDisplay objectOnDisplay={objectOnDisplay} />);
        } else if (type === SearchType.COURSE) {
            return (<CourseResultDisplay courseObj={objectOnDisplay} />);
        } else if (type === SearchType.SECTION) {
            return (<SectionResultDisplay sectionObj={objectOnDisplay}
                                        handleAddRemoveSection={this.handleAddRemoveSection}
                                        isSectionAdded={this.isSectionAdded()} />);
        } else {
            return null;
        }
    }

    failedDisplay() {
        return (
            <ErrorDisplay error={this.props.error} 
                            type={this.props.typeObjectOnDisplay}>
            </ErrorDisplay>
        );
    }

    render() {
        return (
            <div className="container">   
                <div className="search-wrapper">
                    <SearchForm />
                    {this.renderResultDisplay()}
                </div>
                <TimetableControl />
            </div>
        )
    }
}

const mapState = state => ({
    objectOnDisplay: state.search.objectOnDisplay,
    typeObjectOnDisplay: state.search.typeObjectOnDisplay,
    status: state.search.status,
    error: state.search.error,
    addedSections: state.timetable.addedSections
});

export default connect(mapState, { addSection, removeSection })(AppControl);