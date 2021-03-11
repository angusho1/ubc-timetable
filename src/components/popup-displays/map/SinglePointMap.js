import React, { Component } from 'react';
import { connect } from 'react-redux';
import PopUp from '../PopUp';

export class SinglePointMap extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
    }

    getCurrentLocationData() {
        return this.props.activeLocations.find(location => {
            return location.building === this.props.currentBuilding;
        });
    }

    getMapOptions(coords) {
        return {
            zoom: 17,
            center: coords
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentBuilding && !prevProps.currentBuilding) {
            this.loadMap();
        } else if (this.props.currentBuilding !== prevProps.currentBuilding) {
            this.updateLocation();
        }
    }

    loadMap() {
        const locationData = this.getCurrentLocationData();
        const building = locationData.building;
        const address = locationData.address;
        const coords = locationData.location;
        const mapOptions = this.getMapOptions(coords);

        const mapDiv = this.mapRef.current;
        this.map = new window.google.maps.Map(mapDiv, mapOptions);
        const marker = this.createMarker(coords);
        const infoWindow = this.createInfoWindow(`<h3>${building}</h3>${address}`);
        this.addMarkerClickListener(marker, infoWindow);
        
        infoWindow.open(this.map, marker);
    }

    updateLocation() {
        if (this.map === null) {
            throw new Error('No map to update');
        }

        const locationData = this.getCurrentLocationData();
        const coords = locationData.location;

        const newCenter = new window.google.maps.LatLng(coords.lat, coords.lng);
        this.map.panTo(newCenter);
    }

    createMarker(coords) {
        return new window.google.maps.Marker({
            position: coords,
            map: this.map
        });
    }

    createInfoWindow(content) {
        return new window.google.maps.InfoWindow({content});
    }

    addMarkerClickListener(marker, infoWindow) {
        window.google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(this.map, marker);
        });
    }

    render() {
        if (this.props.currentBuilding === null) return null;

        return (
            <PopUp open={this.props.open}
                    header={this.props.currentBuilding}
                    closeModal={this.props.closeModal}>
                <div ref={this.mapRef} className="map"></div>
            </PopUp>
        )
    }
}

const mapState = state => ({
    activeLocations: state.map.activeLocations,
});

export default connect(mapState)(SinglePointMap);
