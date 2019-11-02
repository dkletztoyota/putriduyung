import React, {Component} from 'react'
import {connect} from 'react-redux'
import MapView, {Marker} from 'react-native-maps'
import {Dimensions} from 'react-native'

import Creators from '../../Redux/ParkingLotsRedux'

const InitialRegion = {
  latitude: -6.2290459,
  longitude: 106.7993198,
  longitudeDelta: 0.1,
  latitudeDelta: 0.1
}

const DefaultRange = 1000

class ParkingLotsMap extends Component {
  constructor (props) {
    super(props)
    this.state = {
      region: null,
      map: null
    }
    props.fetchParkingLots(InitialRegion, DefaultRange)
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {searchLocation} = this.props
    const {region} = this.state
    const {region: oldRegion} = prevState

    if (oldRegion !== region) {
      return
    }

    if (this.map !== null && searchLocation !== null) {
      this.map.animateToRegion({
        ...this.state.region,
        latitude: searchLocation.lat,
        longitude: searchLocation.lng
      })
    }
  }

  onRegionChange = (region) => {
    const {fetchParkingLots} = this.props
    this.setState({
      region
    })
    fetchParkingLots(region, DefaultRange)
  }

  render () {
    const { parkingLots } = this.props
    return (
      <MapView
        ref={ref => { this.map = ref }}
        style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
        initialRegion={InitialRegion}
        onRegionChangeComplete={this.onRegionChange}
        showsUserLocation
      >
        {parkingLots ? parkingLots.map(parkingLot => (
          <Marker
            coordinate={{
              latitude: parkingLot.latitude,
              longitude: parkingLot.longitude
            }}
            title={parkingLot.name}
          />
        )) : null}
      </MapView>
    )
  }
}

const mapStateToProps = state => {
  return {
    parkingLots: state.parkingLots.data,
    searchLocation: state.search.location
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchParkingLots: (location, range) => dispatch(Creators.parkingLotsRequest({ location, range }))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParkingLotsMap)
