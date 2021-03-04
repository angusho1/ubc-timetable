import React, { Component } from 'react';
import { connect } from 'react-redux';
import PopUp from '../PopUp';

export class SinglePointMap extends Component {
    mapOptions = {
        zoom: 16,
        center: this.props.coords
    }

    getMap() {
        const building = this.props.building;
        const address = this.props.address;
        const mapDiv = (<div className="map"></div>);
        const map = new google.maps.Map(mapDiv, this.mapOptions);
        const marker = this.createMarker(this.props.coords, map);
        const infoWindow = this.createInfoWindow(`<h3>${building}</h3>${address}`);

        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(map,marker);
        });

        infoWindow.open(map,marker);

        return map;
    }

    createMarker(coords, map) {
        return new google.maps.Marker({
            position: coords,
            map
        });
    }

    createInfoWindow(content) {
        return new google.maps.InfoWindow({content});
    }

    render() {
        if (!this.props.coords) return null;
        console.log(this.props.coords);

        return (
            <PopUp header={this.props.building}>
                { this.getMap() }
            </PopUp>
        )
    }
}

const mapState = state => ({
    coords: state.map.coords,
    address: state.map.address,
    building: state.map.building
});

export default connect(mapState)(SinglePointMap);
