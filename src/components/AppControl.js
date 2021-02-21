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

    handleAddRemoveSection = () => {
        if (this.isSectionAdded()) {
            
        } else {
            this.props.addSection({
                tableKey: 'table1',
                deptObj: this.props.objectOnDisplay,
                course: this.props.currentCourseKey,
                section: this.props.currentSectionKey
            });
        }
    }

    isSectionAdded = () => {
        const sectionCode = this.getCurrentSectionCode();
        return this.props.addedSections.includes(sectionCode);
    }

    getCurrentSectionCode() {
        const deptKey = this.props.objectOnDisplay.subjCode;
        return `${deptKey} ${this.props.currentCourseKey} ${this.props.currentSectionKey}`;
    }

    renderResultDisplay() {
        const type = this.props.typeObjectOnDisplay;
        const objectOnDisplay = this.props.objectOnDisplay;
        if (this.props.status == 'pending' || this.props.status == 'idle') return null;
        if (type === SearchType.DEPT) {
            return (<DeptResultDisplay objectOnDisplay={objectOnDisplay} />);
        } else if (type === SearchType.COURSE) {
            return (<CourseResultDisplay courseObj={objectOnDisplay}
                                        courseKey={this.props.currentCourseKey} />);
        } else if (type === SearchType.SECTION) {
            return (<SectionResultDisplay objectOnDisplay={objectOnDisplay}
                                        courseKey={this.props.currentCourseKey}
                                        sectionKey={this.props.currentSectionKey}
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
    currentCourseKey: state.search.currentCourseKey,
    currentSectionKey: state.search.currentSectionKey,
    status: state.search.status,
    error: state.search.error,
    addedSections: state.timetable.addedSections
});

export default connect(mapState, { addSection, removeSection })(AppControl);