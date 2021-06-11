import React from 'react';
import { SinglePointMap } from '../maps/SinglePointMap';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import './MapModal.scss';


function MapModal(props) {
    const getCurrentLocationData = () => {
        return props.activeLocations.find(location => {
            return location.building === props.currentBuilding;
        });
    }

    return (
        <Modal centered size="lg" id="mapModal" aria-labelledby="mapModalTitle" show={props.show} onHide={props.onHide} dialogClassName="map-modal">
            <Modal.Header closeButton>
                <Modal.Title id="mapModalTitle">
                    {props.currentBuilding}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SinglePointMap currentBuilding={props.currentBuilding} 
                                locationData={getCurrentLocationData()}/>
            </Modal.Body>
        </Modal>
    )
}

const mapState = state => ({
    activeLocations: state.map.activeLocations,
    currentBuilding: state.map.currentBuilding
});

export default connect(mapState)(MapModal);