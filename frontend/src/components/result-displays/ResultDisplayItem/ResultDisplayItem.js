import React, { Component } from 'react';
import './ResultDisplayItem.scss';

export class ResultDisplayItem extends Component {
    render() {
        return (
            <div className="result-display-item list-group-item list-group-item-action" onClick={this.props.onClick}>
                <h6 className="mb-1 fw-bold">{this.props.heading}</h6>
                <span className="label fw-light fs-6">{this.props.label}</span>
            </div>
        );
    }
}

export default ResultDisplayItem;
