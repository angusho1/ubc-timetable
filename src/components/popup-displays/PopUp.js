import React, { Component } from 'react';
import './pop-up.css';

export class PopUp extends Component {
    getVisibility() {
        return {
            display: this.props.open ? 'flex' : 'none'
        }
    }

    render() {
        return (
            <div style={this.getVisibility()} className="pop-up">
                <div className="pop-up-container">
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
