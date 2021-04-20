import React, { Component } from 'react';

export class ResultDisplay extends Component {
    determineClasses() {
        let classList = 'container-box visible';
        return classList;
    }

    render() {
        return (
            <div id="display-box" className={this.determineClasses()}>
                <h3>{this.props.title}</h3>
                <p>{this.props.subHeading}</p>
                {this.props.children}
            </div>
        )
    }
}

export default ResultDisplay;
