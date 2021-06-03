import React, { Component } from 'react';
import './ResultDisplayItem.scss';

export class ResultDisplayItem extends Component {
    render() {
        return (
            <div className="result-display-item list-group-item list-group-item-action" onClick={this.props.onClick}>
                <span className="heading">
                    <b>{this.props.heading}</b>
                </span>
                {" - "}
                <span className="label">{this.props.label}</span>
            </div>
        );
    }
}

export default ResultDisplayItem;
