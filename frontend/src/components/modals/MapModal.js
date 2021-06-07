import React from 'react';
import { SinglePointMap } from '../popup-displays/map/SinglePointMap';
import { connect } from 'react-redux';
import Modal from './Modal';

function MapModal(props) {
    const getCurrentLocationData = () => {
        return props.activeLocations.find(location => {
            return location.building === props.currentBuilding;
        });
    }

    return (
        <Modal id="mapModal" header={props.currentBuilding}>
            <SinglePointMap currentBuilding={props.currentBuilding} locationData={getCurrentLocationData()}/>
        </Modal>
    )
}

const mapState = state => ({
    activeLocations: state.map.activeLocations,
    currentBuilding: state.map.currentBuilding
});

export default connect(mapState)(MapModal);