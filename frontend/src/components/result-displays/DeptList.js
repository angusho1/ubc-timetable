import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import ResultDisplay from './ResultDisplay';
import ResultDisplayItem from './ResultDisplayItem/ResultDisplayItem';
import { searchDept, getDeptList } from '../../reducers/searchSlice';
import { getDeptTitle, getDeptKey } from '../../utils/selectors.js';
import { ScraperContext } from '../AppControl';

function DeptList(props) {
    const scraperType = useContext(ScraperContext);

    const renderDept = (dept) => {
        const deptKey = getDeptKey(dept);
        const session = { year: 2021, season: 'W' }
        const deptSearchParams = { dept: deptKey, session, scraperType };
        return (<ResultDisplayItem key={deptKey}
                                    heading={deptKey}
                                    label={getDeptTitle(dept)}
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
            props.getDeptList({ session, scraperType });
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