import React, { Component } from 'react';
import { connect } from 'react-redux';
import PopUp from '../PopUp';

export class SinglePointMap extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.state = { loaded: false }
    }

    mapOptions = {
        zoom: 17,
        center: this.props.coords
    }

    componentDidMount() {
        if (this.props.coords) {
            this.getMap();
        }
    }

    getMap() {
        const building = this.props.building;
        const address = this.props.address;
        const mapDiv = this.mapRef.current;
        const map = new window.google.maps.Map(mapDiv, this.mapOptions);
        const marker = this.createMarker(this.props.coords, map);
        const infoWindow = this.createInfoWindow(`<h3>${building}</h3>${address}`);

        window.google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(map,marker);
        });

        infoWindow.open(map,marker);
        
        this.setState({ loaded: true });
    }

    createMarker(coords, map) {
        return new window.google.maps.Marker({
            position: coords,
            map
        });
    }

    createInfoWindow(content) {
        return new window.google.maps.InfoWindow({content});
    }

    getMapVisibility() {
        return this.state.loaded ? { visibility: 'visible' } : { visibility: 'hidden' };
    }

    render() {
        if (!this.props.coords) return null;

        return (
            <PopUp header={this.props.building}>
                <div style={this.getMapVisibility()} ref={this.mapRef} className="map"></div>
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
