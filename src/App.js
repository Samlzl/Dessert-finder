import React, { Component } from 'react';
import './App.css';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import AppSidebar from './components/AppSidebar';
import AppInfobar from './components/AppInfobar'
import AppMap from './components/AppMap';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allUsers: [{position: {lat: 34.402367, lng: -119.726738},
        name: "Sam Nakamoto",
        id: 0,
        dessert: "Apple Pie"},
        {position: {lat: 34.404507, lng: -119.705515},
        name: "Joe Buterin",
        id: 1,
        dessert: "Peach Cobbler"},
        {position: {lat: 34.414019, lng: -119.727126},
        name: "Katie Lovelace",
        id: 2,
        dessert: "Cheesecake"},
        {position: {lat: 34.433996, lng: -119.711859},
        name: "Adam Smith",
        id: 3,
        dessert: "Tiramisu"},
        {position: {lat: 34.439817, lng: -119.688069},
        name: "John Doe",
        id: 4,
        dessert: "Bread Pudding"},
        {position: {lat: 34.442228, lng: -119.693895},
        name: "Shawn Fanning",
        id: 5,
        dessert: "Chocolate Fudge"},
        {position: {lat: 34.420138, lng: -119.734574},
        name: "Robin Chase",
        id: 6,
        dessert: "Cupcakes"}],
      filteredUsers:[],
      currentUsers: [],
      usersHolder:[],
      query:"",
      currentMap: {},
      markers: [],
      infoWindows: [],
      inforWindowOpen:{},
      showInfobar: false
    }
  } 

  getUsers = () => {
    fetch("https://api.myjson.com/bins/cm76u")
      .then(resp => resp.json())
      .then(data => {this.setState({usersHolder: data.users})})
  }

  componentDidMount = () => {
    this.getUsers()
    this.setState({currentUsers: this.state.allUsers})
  }

  componentDidUpdate = (_, prevState) => {
    if (this.state.showInfobar ===true) {
      document.getElementById("infobar").style.display = "block"
      const app = document.getElementById("app")
      app.style.setProperty('grid-template-columns','400px 1fr')
      //document.getElementById("app").style.grid-template-columns = "400px 1fr"
  }}

  filterUsers = (_filteredUsers) => {
    this.setState({currentUsers:_filteredUsers})
    this.setState({filteredUsers:_filteredUsers})
  }

  updateQuery = (query) => {
    this.setState({query: query.target.value.trim()})
  }

  handleClick = (clicked) => {
    console.log(clicked)
    let liValue
    let marker
    if (clicked.target) {
      liValue = clicked
      const matchedMarker = this.state.markers
        .find(marker => marker.title === liValue.target.innerHTML)
      const matchedInfoWindow = this.state.infoWindows
        .find(infowindow => infowindow.content.includes(matchedMarker.title))
      const matchedUser = this.state.currentUsers
        .find(user => user.dessert === liValue.target.innerHTML)
      this.showInfoWindow(matchedMarker, matchedInfoWindow)
      this.setState({showInfobar: true})
    } else {
      marker = clicked
      const matchedInfoWindow = this.state.infoWindows
        .find(infowindow => infowindow.content.includes(marker.title))
      this.showInfoWindow(marker, matchedInfoWindow)
    }}

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 34.420830, lng: -119.698189},
      zoom: 13
    })
    this.setState({map : map})
    this.makeMarkers(map)
    this.makeInfoWindows(this.state.markers)
  }

  makeMarkers = (map) => {
    let marker
    let _markers = []
    this.state.currentUsers.forEach(user => {
      marker = new window.google.maps.Marker({
      position: user.position,
      map: map,
      animation: window.google.maps.Animation.DROP,
      title: user.dessert})
      _markers = [..._markers, marker]
    })
    this.setState({markers : _markers})
    _markers.forEach(marker => this.add_listener(marker))
  }

  setMarkers = (map, markers) => {
    markers.map( marker => marker.setMap(map))
  }

  add_listener = (marker) => {
    marker.addListener('click', () => {this.handleClick(marker)})
  }

  makeInfoWindows = (markers) => {
    let infowindow
    let _infowindows = []
    markers.forEach(marker => {
      infowindow = new window.google.maps.InfoWindow({
        content: `<div id="content"> <h1>${marker.title}</h1> </div>`
      })
      _infowindows = [..._infowindows, infowindow]
    })
    this.setState({infoWindows : _infowindows})
  }

  showInfoWindow = (marker, infoWindow) => {
    infoWindow.open(this.state.map, marker)
    this.setState({infoWindowOpen: infoWindow})
  }

  showInfobar = () => {
    document.getElementsByClassName("infobar").style.display = "block"
  }

  //closeInfoWindow = (infowindow) => {
  //  infowindow.close()
  //}

  render() {
    return (
      <div id="app">
        <AppHeader />
        <AppSidebar
          query = {this.state.query}
          updateQuery = {this.updateQuery}
          allUsers = {this.state.allUsers}
          currentUsers = {this.state.currentUsers}
          filterUsers = {this.filterUsers}
          handleClick = {this.handleClick}
        />
        <AppInfobar
        />
        <AppMap 
          currentUsers = {this.state.filteredUsers.length === 0 ? this.state.allUsers : this.state.filteredUsers}
          initMap = {this.initMap}
          map = {this.state.map}
          markers = {this.state.markers}
          makeMarkers = {this.makeMarkers}
          setMarkers = {this.setMarkers}
          infoWindows = {this.state.InfoWindows}
          makeInfoWindows = {this.makeInfoWindows}
          closeInfoWindow = {this.state.closeInfoWindow}
        />
        <AppFooter />

      </div>
    );
  }
}

export default App;
