import React from 'react';
import { connect } from 'react-redux';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem/ResultDisplayItem';
import { searchDept, getDeptList } from '../../reducers/searchSlice';

function DeptList(props) {

    const renderDept = (dept) => {
        const deptSearchParams = { dept: dept.subjCode };
        return (<ResultDisplayItem key={dept.subjCode}
                                    heading={dept.subjCode}
                                    label={dept.title}
                                    onClick={() => props.searchCourse(deptSearchParams)} />);
    }

    const render = () => {
        if (!props.objectOnDisplay) {
            const session = { year: 2020, season: 'W' };
            props.getDeptList({ session });
            return null;
        } else {
            return props.deptList.map(dept => renderDept(dept));
        }
    }

    return (
        <ResultDisplay title="Find by Subject" subHeading="">
            {render()}
        </ResultDisplay>
    )
}

export default connect(null, { searchDept, getDeptList })(DeptList);