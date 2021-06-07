import React, { useState } from 'react';

function Modal(props) {
    const labelId = `${props.id}Label`;

    return (
        <div className="modal fade" id={props.id} tabIndex="-1" 
            aria-labelledby={labelId} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={labelId}>{props.header}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;