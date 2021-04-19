import React from 'react';
import { connect } from 'react-redux';
import { searchDept, searchCourse, searchSection } from '../../reducers/searchSlice';
import SearchInput from './SearchInput';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

const DEPT_REGEX = /^\s*[a-z]{2,4}\s*$/i;
const COURSE_SECTION_REGEX = /^\s*[a-z0-9]{3,4}\s*$/i;
const EMPTY_REGEX = /^\s*$/;

function SearchForm(props) {

    const validationSchema = Yup.object().shape({
        deptValue: Yup.string()
            .matches(DEPT_REGEX)
            .required(),
        courseValue: Yup.string()
            .matches(COURSE_SECTION_REGEX)
            .when('sectionValue', {
                is: sectionValue => sectionValue && sectionValue.length > 0,
                then: Yup.string().required(),
            }),
        sectionValue: Yup.string()
            .matches(COURSE_SECTION_REGEX, { excludeEmptyString: true })
    });

    const handleFormSubmit = (values, actions) => {
        const dept = values.deptValue;
        const course = values.courseValue;
        const section = values.sectionValue;
        initSearch(dept, course, section);
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

    return (
        <Formik
            initialValues={{ deptValue: '', courseValue: '', sectionValue: ''}}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
        >   
            <Form className="container-box">
                <h2>Find a Course:</h2>
                <div className="form-container">
                    <SearchInput    id="deptValue"
                                    label="Department" 
                                    placeholder="ex: CPSC"
                                    name="deptValue"
                    />
                    <SearchInput    id="courseValue"
                                    label="Course" 
                                    placeholder="ex: 210"
                                    name="courseValue"
                    />
                    <SearchInput    id="sectionValue"
                                    label="Section" 
                                    placeholder="ex: 103"
                                    name="sectionValue"
                    />
                </div>

                <input className="btn" type="submit" id="search-btn" value="Search" />
            </Form>
        </Formik>
    )
}

const mapDispatch = { searchDept, searchCourse, searchSection };

export default connect(null, mapDispatch)(SearchForm);
