import React, { useState } from 'react';
import { connect } from 'react-redux';
import { searchDept, searchCourse, searchSection } from '../../reducers/searchSlice';
import SearchInput from './SearchInput';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

const DEPT_REGEX = /^\s*[a-z]{2,4}\s*$/i;
const COURSE_SECTION_REGEX = /^\s*[a-z0-9]{3,4}\s*$/i;

function SearchForm(props) {
    const [searched, setSearched] = useState(false);

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
        setSearched(true);
        const dept = values.deptValue;
        const course = values.courseValue;
        const section = values.sectionValue;
        initSearch(dept, course, section);
    }

    const initSearch = (dept, course, section) => {
        const session = { year: 2020, season: 'W' } // TODO: Remove hardcoded session

        if (section.length > 0) {
            props.searchSection({ dept, course, section, session });
        } else if (course.length > 0) {
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
            <Form className="card p-4 mb-4 bg-light">
                <div className="card-title fs-5 text-dark">Find a Course:</div>
                <div className={searched ? "row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 gx-2" : "row gx-2"}>
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

                <div>
                    <input className="btn btn-primary" type="submit" value="Search" />
                </div>
            </Form>
        </Formik>
    )
}

const mapDispatch = { searchDept, searchCourse, searchSection };

export default connect(null, mapDispatch)(SearchForm);
