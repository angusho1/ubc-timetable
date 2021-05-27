import React, { Component } from 'react';
import { SearchType } from '../data/SearchType';
import SearchForm from './search/SearchForm';
import TimetableControl from './timetable/TimetableControl';
import DeptResultDisplay from './result-displays/DeptResultDisplay';
import CourseResultDisplay from './result-displays/CourseResultDisplay';
import SectionResultDisplay from './result-displays/SectionResultDisplay';
import ErrorDisplay from './result-displays/ErrorDisplay';
import SinglePointMap from './popup-displays/map/SinglePointMap';
import { connect } from 'react-redux';
import { addSection, removeSection } from '../reducers/timetableSlice';

export class AppControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapOpen: false,
            currentBuilding: null
        }
    }

    handleAddRemoveSection = () => {
        const payload = {
            // tableKey: this.props.currentTableKey, //  need to change
            sectionObj: this.props.objectOnDisplay
        };
        if (this.isSectionAdded()) {
            this.props.removeSection(payload);
        } else {
            this.props.addSection(payload);
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

    openMap = (building) => {
        this.setState({ currentBuilding: building,
                        mapOpen: true });
    }

    closeModal = (e) => {
        this.setState({ mapOpen: false });
    }

    renderResultDisplay() {
        const type = this.props.typeObjectOnDisplay;
        const objectOnDisplay = this.props.objectOnDisplay;
        if (this.props.status === 'pending') return null;
        if (this.props.status === 'failed') return this.failedDisplay();
        if (type === SearchType.DEPT) {
            return (<DeptResultDisplay deptObj={objectOnDisplay} />);
        } else if (type === SearchType.COURSE) {
            return (<CourseResultDisplay courseObj={objectOnDisplay} />);
        } else if (type === SearchType.SECTION) {
            return (<SectionResultDisplay sectionObj={objectOnDisplay}
                                        handleAddRemoveSection={this.handleAddRemoveSection}
                                        isSectionAdded={this.isSectionAdded()}
                                        openMap={this.openMap} />);
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
                <div className="row">
                    <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-12">
                        <SearchForm />
                        {this.renderResultDisplay()}
                    </div>
                    <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12 col-12">
                        <TimetableControl />
                    </div>
                    <SinglePointMap currentBuilding={this.state.currentBuilding}
                                    open={this.state.mapOpen}
                                    closeModal={this.closeModal}/>
                </div>
            </div>
        )
    }
}

function selectAddedSections(state) {
    const currentSession = state.search.currentSession;
    return state.timetable.sessions.find(session => {
        return session.year === currentSession.year &&
         session.season === currentSession.season;
    }).addedSections;
}

const mapState = state => ({
    objectOnDisplay: state.search.objectOnDisplay,
    typeObjectOnDisplay: state.search.typeObjectOnDisplay,
    currentSession: state.search.currentSession,
    status: state.search.status,
    error: state.search.error,
    currentTableKey: state.timetable.currentTableKey,
    addedSections: selectAddedSections(state)
});

export default connect(mapState, { addSection, removeSection })(AppControl);