import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Modal.scss';

function ErrorModal(props) {
    return (
        <Modal id="errorModal" aria-labelledby="errorModalTitle" show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title id="errorModalTitle">
                    <i className="bi bi-exclamation-circle text-danger align-top"></i>
                    <span className="m-3">Timetable Conflict</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ErrorModal;