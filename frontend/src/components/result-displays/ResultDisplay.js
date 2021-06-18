import React, { Component } from 'react';
import './ResultDisplays.scss';

export class ResultDisplay extends Component {

    render() {
        return (
            <div id="display-box" className="card p-4 bg-light">
                <div className="card-title h5 fw-bold">{this.props.title}</div>
                <p>{this.props.subHeading}</p>
                {this.props.children}
            </div>
        )
    }
}

export default ResultDisplay;
