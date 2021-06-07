import React, { Component } from 'react';
import './PopUp.scss';

export class PopUp extends Component {
    getVisibility() {
        return {
            display: this.props.open ? 'flex' : 'none'
        }
    }

    render() {
        return (
            // <div style={this.getVisibility()} className="pop-up">
            //     <div className="pop-up-container">
            //         <div id="modal-content-top">
            //             <span className="h5 text-dark fw-bold" style={{marginTop: '25px'}}>
            //                 {this.props.header}
            //             </span>
            //             <span className="close-btn" onClick={this.props.closeModal}>x</span>
            //         </div>
            //         <div id="map-container">
            //             {this.props.children}
            //         </div>
            //     </div>
            // </div>
            <div className="modal fade" id="mainModal" tabIndex="-1" aria-labelledby="mainModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="mainModalLabel">{this.props.header}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div id="map-container">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopUp;
