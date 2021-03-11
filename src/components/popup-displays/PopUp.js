import React, { Component } from 'react';

export class PopUp extends Component {
    getVisibility() {
        return {
            display: this.props.open ? 'inline-block' : 'none'
        }
    }

    render() {
        return (
            <div style={this.getVisibility()} className="pop-up">
                <div className="modal-content">
                    <div id="modal-content-top">
                        <span className="h3-style" style={{marginTop: '25px'}}>
                            {this.props.header}
                        </span>
                        <span className="close-btn" onClick={this.props.closeModal}>x</span>
                    </div>
                    <div id="map-container">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

export default PopUp;
