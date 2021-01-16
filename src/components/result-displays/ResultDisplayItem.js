import React, { Component } from 'react';

export class ResultDisplayItem extends Component {
    render() {
        return (
            <p>
                <b>{this.props.heading}</b> - {this.props.label}
            </p>
        );
    }
}

export default ResultDisplayItem;
