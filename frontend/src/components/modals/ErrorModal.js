import React from 'react';
import Modal from 'react-bootstrap/Modal';
import './Modal.scss';

function ErrorModal(props) {
    return (
        <Modal size="sm" id="errorModal" aria-labelledby="errorModalTitle" show={props.show} onHide={props.onHide} dialogClassName="map-modal">
            <Modal.Header closeButton>
                <Modal.Title id="errorModalTitle">
                    {props.message}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* TODO: Remove this hardcoded error message */}
                The section couldn't be added because it conflicts with another section.
            </Modal.Body>
        </Modal>
    )
}

export default ErrorModal;