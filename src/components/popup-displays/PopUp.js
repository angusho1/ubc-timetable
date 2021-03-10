import React, { Component } from 'react';

export class PopUp extends Component {
    constructor(props) {
        super(props);
        this.state = { open: true };
    }

    closeModal = (e) => {
        this.setState({ open: false });
    }

    getVisibility() {
        return {
            display: this.state.open ? 'display-block' : 'none'
        }
        // return this.state.open ? { display: 'visible' } : { visibility: 'hidden' };
    }

    render() {
        if (!this.state.open) return null;

        return (
            <div style={this.getVisibility()} className="pop-up">
                <div className="modal-content">
                    <div id="modal-content-top">
                        <span className="h3-style" style={{marginTop: '25px'}}>
                            {this.props.header}
                        </span>
                        <span className="close-btn" onClick={this.closeModal}>x</span>
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
