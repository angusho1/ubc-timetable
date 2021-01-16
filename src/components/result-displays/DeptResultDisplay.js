import React, { Component } from 'react';
import ResultDisplay from './ResultDisplay';

export class DeptResultDisplay extends Component {
    getTitle() {
        const obj = this.props.objectOnDisplay;
        return `${obj.title} ${obj.subjCode}`;
    }

    getSubHeading() {
        return this.props.objectOnDisplay.faculty;
    }

    renderDisplayComponents() {
        return (<div></div>);
    }

    render() {
        return (
            <ResultDisplay  title={this.getTitle()}
                            subHeading={this.getSubHeading()}>
                {this.renderDisplayComponents()}
            </ResultDisplay>
        )
    }
}

export default DeptResultDisplay;
