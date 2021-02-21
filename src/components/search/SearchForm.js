import React, { Component } from 'react';
import { connect } from 'react-redux';
import { searchDept, searchCourse, searchSection } from '../../reducers/searchSlice';
import SearchInput from './SearchInput';

const DEPT_REGEX = /^\s*[a-z]{2,4}\s*$/i;
const COURSE_SECTION_REGEX = /^\s*[a-z0-9]{3,4}\s*$/i;
const EMPTY_REGEX = /^\s*$/;

export class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deptValue: '',
            deptValid: false,
            deptSearched: false,
            courseValue: '',
            courseValid: false,
            courseSearched: false,
            sectionValue: '',
            sectionValid: false,
            sectionSearched: false
        };
    }

    handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        });
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        const dept = this.state.deptValue;
        const course = this.state.courseValue;
        const section = this.state.sectionValue;
        const inputValidityState = this.validateInputs(dept, course, section);
        this.updateInputState(dept, course, section, inputValidityState);
        this.initSearch(dept, course, section);
    }

    clearText(inputName) {
        this.setState({ [inputName]: '' });
    }

    validateInputs(dept, course, section) {
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

    initSearch(dept, course, section) {
        const courseEmpty = EMPTY_REGEX.test(course);
        const sectionEmpty = EMPTY_REGEX.test(section);

        if (!sectionEmpty) {
            this.props.searchSection({ dept, course, section });
        } else if (!courseEmpty) {
            this.props.searchCourse({ dept, course })
        } else {
            this.props.searchDept({ dept });
        }
    }

    updateInputState(dept, course, section, inputValidityState) {
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

        this.setState({
            deptSearched,
            courseSearched,
            sectionSearched,
            deptValid: inputValidityState.dept,
            courseValid: inputValidityState.course,
            sectionValid: inputValidityState.section
        });
    }    

    render() {
        return (
            <form className="container-box" onSubmit={this.handleFormSubmit}>
                <h2>Find a Course:</h2>
                <div className="form-container">
                    <SearchInput    inputId="dept-input"
                                    label="Department" 
                                    placeholder="ex: CPSC"
                                    name="deptValue"
                                    value={this.state.deptValue}
                                    valid={this.state.deptValid}
                                    searched={this.state.deptSearched}
                                    handleInputChange={this.handleInputChange}
                                    clearText={this.clearText.bind(this)}
                    />
                    <SearchInput    inputId="course-input"
                                    label="Course" 
                                    placeholder="ex: 210"
                                    name="courseValue"
                                    value={this.state.courseValue}
                                    valid={this.state.courseValid}
                                    searched={this.state.courseSearched}
                                    handleInputChange={this.handleInputChange}
                                    clearText={this.clearText.bind(this)}
                    />
                    <SearchInput    inputId="section-input"
                                    label="Section" 
                                    placeholder="ex: 103"
                                    name="sectionValue"
                                    value={this.state.sectionValue}
                                    valid={this.state.sectionValid}
                                    searched={this.state.sectionSearched}
                                    handleInputChange={this.handleInputChange}
                                    clearText={this.clearText.bind(this)}
                    />
                </div>

                <input className="btn" type="submit" id="search-btn" value="Search" />
            </form>
        )
    }
}

const mapDispatch = { searchDept, searchCourse, searchSection };

export default connect(null, mapDispatch)(SearchForm);
