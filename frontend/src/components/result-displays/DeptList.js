import React, { useEffect } from 'react';
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
                                    onClick={() => props.searchDept(deptSearchParams)} />);
    }

    const render = () => {
        if (!props.deptList) {
            return null;
        } else {
            return props.deptList.map(dept => renderDept(dept));
        }
    }

    useEffect(() => {
        if (!props.deptList) {
            const session = { year: 2021, season: 'W' };
            props.getDeptList({ session });
        }
    });

    return (
        <ResultDisplay title="Find by Subject" subHeading="">
            <div className="list-group result-display-item-container">
                {render()}
            </div>
        </ResultDisplay>
    )
}

export default connect(null, { searchDept, getDeptList })(DeptList);