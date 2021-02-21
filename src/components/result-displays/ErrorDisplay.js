import React, { Component } from 'react';
import ResultDisplay from './ResultDisplay';

export class ErrorDisplay extends Component {
    renderDisplayComponents() {
        const errorMessage = this.props.error;
        return (
            <h4 style={this.errorStyle}>{errorMessage}</h4>
        );
    }

    errorStyle = {
        'font-style': 'italic'
    }

    render() {
        return (
            <ResultDisplay  title={"Search Not Found"}
                            subHeading={null}>
                {this.renderDisplayComponents()}
            </ResultDisplay>
        )
    }
}

export default ErrorDisplay;
