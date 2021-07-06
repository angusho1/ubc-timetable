import React, { Component, createContext } from 'react';
import { SearchType } from '../data/SearchType';
import SearchForm from './search/SearchForm';
import TimetableControl from './timetable/TimetableControl';
import DeptResultDisplay from './result-displays/DeptResultDisplay';
import CourseResultDisplay from './result-displays/CourseResultDisplay';
import SectionResultDisplay from './result-displays/SectionResultDisplay';
import ErrorDisplay from './result-displays/ErrorDisplay';
import { connect } from 'react-redux';
import { addSection, removeSection } from '../reducers/timetableSlice';
import DeptList from './result-displays/DeptList';
import { ScraperType } from '../data/ScraperType';
import { getSectionCode } from '../utils/selectors';

export const ScraperContext = createContext(ScraperType.NATIVE);

export class AppControl extends Component {

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
        return getSectionCode(sectionObj);
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
                                        />);
        } else if (type === SearchType.SUBJECTS) {
            return (<DeptList deptList={objectOnDisplay} />);
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
            <ScraperContext.Provider value={ScraperType.NATIVE}>
            <div className="container-fluid p-4">
                <div className="row gy-4">
                    <div className="col-xl-3 col-lg-4 col-md-12">
                        <div className="row">
                            <div className={"col-lg-12 col-md-5 col-sm-4 col-12"}>
                                <SearchForm />
                            </div>
                            <div className={"col-lg-12 col-md-7 col-sm-8 col-12"}>
                                {this.renderResultDisplay()}
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-9 col-lg-8 col-md-12">
                        <TimetableControl />
                    </div>
                </div>
            </div>
            </ScraperContext.Provider>
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