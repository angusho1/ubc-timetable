import React, { useState } from 'react';
import { connect } from 'react-redux';
import { searchDept, searchCourse, searchSection } from '../../reducers/searchSlice';
import SearchInput from './SearchInput';

const DEPT_REGEX = /^\s*[a-z]{2,4}\s*$/i;
const COURSE_SECTION_REGEX = /^\s*[a-z0-9]{3,4}\s*$/i;
const EMPTY_REGEX = /^\s*$/;

function SearchForm(props) {
    const [deptValue, setDeptValue] = useState('');
    const [deptValid, setDeptValid] = useState(false);
    const [deptSearched, setDeptSearched] = useState(false);

    const [courseValue, setCourseValue] = useState('');
    const [courseValid, setCourseValid] = useState(false);
    const [courseSearched, setCourseSearched] = useState(false);

    const [sectionValue, setSectionValue] = useState('');
    const [sectionValid, setSectionValid] = useState(false);
    const [sectionSearched, setSectionSearched] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const dept = deptValue;
        const course = courseValue;
        const section = sectionValue;
        const inputValidityState = validateInputs(dept, course, section);
        updateInputState(dept, course, section, inputValidityState);
        initSearch(dept, course, section);
    }

    const validateInputs = (dept, course, section) => {
        const deptSyntaxValid = DEPT_REGEX.test(dept);
        const courseSyntaxValid = COURSE_SECTION_REGEX.test(course);
        const sectionSyntaxValid = COURSE_SECTION_REGEX.test(section);
        const deptEmpty = EMPTY_REGEX.test(dept);
        const courseEmpty = EMPTY_REGEX.test(course);
        const sectionEmpty = EMPTY_REGEX.test(section);
        const deptValid = !deptEmpty && deptSyntaxValid;
        const courseValid = !courseEmpty && courseSyntaxValid;
        const sectionValid = !sectionEmpty && sectionSyntaxValid;

        const deptInputValid = deptValid;
        const courseInputValid = (!sectionEmpty || !courseEmpty) ? courseValid : true;
        const sectionInputValid = !sectionEmpty ? sectionValid : true;

        return {
            dept: deptInputValid,
            course: courseInputValid,
            section: sectionInputValid,
        };
    }

    const initSearch = (dept, course, section) => {
        const courseEmpty = EMPTY_REGEX.test(course);
        const sectionEmpty = EMPTY_REGEX.test(section);
        const session = { year: 2020, season: 'W' } // TODO: Remove hardcoded session

        if (!sectionEmpty) {
            props.searchSection({ dept, course, section, session });
        } else if (!courseEmpty) {
            props.searchCourse({ dept, course, session });
        } else {
            props.searchDept({ dept, session });
        }
    }

    const updateInputState = (dept, course, section, inputValidityState) => {
        const courseEmpty = EMPTY_REGEX.test(course);
        const sectionEmpty = EMPTY_REGEX.test(section);
        let deptSearched = false;
        let courseSearched = false;
        let sectionSearched = false;

        if (!sectionEmpty) {
            deptSearched = courseSearched = sectionSearched = true;
        } else if (!courseEmpty) {
            deptSearched = courseSearched = true;
        } else {
            deptSearched = true;
        }

        setDeptSearched(deptSearched);
        setCourseSearched(courseSearched);
        setSectionSearched(sectionSearched);
        setDeptValid(inputValidityState.dept);
        setCourseValid(inputValidityState.course);
        setSectionValid(inputValidityState.section);
    }    

    return (
        <form className="container-box" onSubmit={handleFormSubmit}>
            <h2>Find a Course:</h2>
            <div className="form-container">
                <SearchInput    inputId="dept-input"
                                label="Department" 
                                placeholder="ex: CPSC"
                                name="deptValue"
                                value={deptValue}
                                valid={deptValid}
                                searched={deptSearched}
                                handleInputChange={(e) => setDeptValue(e.target.value)}
                                clearText={() => setDeptValue('')}
                />
                <SearchInput    inputId="course-input"
                                label="Course" 
                                placeholder="ex: 210"
                                name="courseValue"
                                value={courseValue}
                                valid={courseValid}
                                searched={courseSearched}
                                handleInputChange={(e) => setCourseValue(e.target.value)}
                                clearText={() => setCourseValue('')}
                />
                <SearchInput    inputId="section-input"
                                label="Section" 
                                placeholder="ex: 103"
                                name="sectionValue"
                                value={sectionValue}
                                valid={sectionValid}
                                searched={sectionSearched}
                                handleInputChange={(e) => setSectionValue(e.target.value)}
                                clearText={() => setSectionValue('')}
                />
            </div>

            <input className="btn" type="submit" id="search-btn" value="Search" />
        </form>
    )
}

const mapDispatch = { searchDept, searchCourse, searchSection };

export default connect(null, mapDispatch)(SearchForm);
