import React, { Component } from 'react'

export class ResultDisplay extends Component {
    render() {
        return (
            <div id="display-box">
                <h3>{this.props.title}</h3>
                <p>{this.props.subHeading}</p>
                {this.props.children}
            </div>
        )
    }
}

export default ResultDisplay
