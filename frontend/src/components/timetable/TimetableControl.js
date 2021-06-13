import './Timetable.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Timetable from './Timetable';
import TimetableMenu from './TimetableMenu';
import { switchTable, setError } from '../../reducers/timetableSlice';
import ErrorModal from '../modals/ErrorModal';

export class TimetableControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
           showModal: false 
        }
    }

    findTable(tables, tableKey) {
        return tables.find(table => table.tableKey === tableKey);
    }

    componentDidUpdate(prevProps) {
        if (this.props.error !== prevProps.error && this.props.error) {
            this.setState({ showModal: true });
        }
    }

    hideErrorModal = () => {
        this.setState({ showModal: false });
        this.props.setError({ error: null });
    }

    render() {
        const timetables = this.props.timetables;
        const currentTableKey = this.props.currentTableKey;
        const currentTable = this.findTable(timetables, currentTableKey);
        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div id="timetable-wrapper">
                <TimetableMenu currentTableKey={currentTableKey}
                                timetables={timetables} 
                                switchTable={this.props.switchTable} />
                <Timetable table={currentTable} days={days} />
                <ErrorModal show={this.state.showModal} 
                            onHide={this.hideErrorModal}
                            message={this.props.error} />
            </div>
        )
    }
}

const mapState = state => ({
    currentTableKey: state.timetable.currentTableKey,
    timetables: state.timetable.tables,
    error: state.timetable.error
});

export default connect(mapState, { switchTable, setError })(TimetableControl);
