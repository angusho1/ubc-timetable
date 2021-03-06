import React, { Component } from 'react';
import './Map.scss';

export class SinglePointMap extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
    }

    getMapOptions(coords) {
        return {
            zoom: 17,
            center: coords
        }
    }

    componentDidMount() {
        this.loadMap();
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentBuilding && !prevProps.currentBuilding) {
            this.loadMap();
        } else if (this.props.currentBuilding !== prevProps.currentBuilding) {
            this.updateLocation();
        }
    }

    loadMap() {
        const locationData = this.props.locationData;
        const building = locationData.building;
        const address = locationData.address;
        const coords = locationData.location;
        const mapOptions = this.getMapOptions(coords);

        const mapDiv = this.mapRef.current;
        this.map = new window.google.maps.Map(mapDiv, mapOptions);
        this.marker = this.createMarker(coords);
        const infoWindow = this.createInfoWindow(building, address);
        this.addMarkerClickListener(this.marker, infoWindow);
        infoWindow.open(this.map, this.marker);
    }

    updateLocation() {
        if (this.map === null || this.marker === null) {
            throw new Error('No map to update');
        }

        this.marker.setMap(null);
        const locationData = this.props.locationData;
        const building = locationData.building;
        const address = locationData.address;
        const coords = locationData.location;

        const newCenter = new window.google.maps.LatLng(coords.lat, coords.lng);
        this.marker = this.createMarker(coords);
        const newInfoWindow = this.createInfoWindow(building, address);
        this.addMarkerClickListener(this.marker, newInfoWindow);
        newInfoWindow.open(this.map, this.marker);
        this.map.panTo(newCenter);
    }

    createMarker(coords) {
        return new window.google.maps.Marker({
            position: coords,
            map: this.map
        });
    }

    createInfoWindow(building, address) {
        const content = `<h5>${building}</h5>${address}`;
        return new window.google.maps.InfoWindow({content});
    }

    addMarkerClickListener(marker, infoWindow) {
        window.google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(this.map, marker);
        });
    }

    render() {
        return (
            <div ref={this.mapRef} className="map"></div>
        );
    }
}

export default SinglePointMap;