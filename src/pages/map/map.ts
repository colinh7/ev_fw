import { LoginPage } from './../login/login';

import { InfoWindowObservable } from './../../models/infoWindowObservable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Http } from '@angular/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Alert, Platform, AlertController, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Node } from '../../models/node'
import { Content } from 'ionic-angular/components/content/content';
//import { CreateNodePage } from '../create-node/create-node';
import { NodeBookingPage } from '../node-booking/node-booking';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { Subscription } from 'rxjs/Subscription';

declare var google;
declare var map;
declare var message;
declare var bookable: any;


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {

  subscriber: Subscription;
  self: any = this;
  bookableNode: any = []
  bookableNodeId: any;
  node = {} as Node;
  infoWindowObservable = {} as InfoWindowObservable;
  chargerType: any
  nodeOwnerId: any;
  @ViewChild('map') mapElement;
  map: any;
  existingThirdPartyMarkers: any = [];
  existingAppMarkers: any = [];
  maxDistance: any;
  geocoder: any;
  markerApp: any;
  lngApp: any;
  infoWindow: any = new google.maps.InfoWindow({
    size: new google.maps.Size(200, 200),
    maxWidth: 140
  })
  markerButton: any;
  deleteMarkerButton: any;
  counter = 0;
  appMarkers = [];
  disabled: boolean;
  addNodeClicked: boolean;
  thirdPartyMarkerInfoWindow: any = new google.maps.InfoWindow({
    maxWidth: 100,
    size: new google.maps.Size(100, 500)
  });
  dbMarker: any;
  appInfoWindow: any = new google.maps.InfoWindow({
    maxWidth: 140,
    size: new google.maps.Size(100, 500)
  })
  eventPageButton: any;
  appMarker: any;
  authState: any = null;
  startTime: any;
  finishTime: any;
  costPer15Mins: any;
  myLat: any;
  myLng: any;
  appLat: any;
  appLng: any;
  thirdPartyLat: any;
  thirdPartyLng: any;
  cancelClicked


  constructor(public events: Events, private afAuth: AngularFireAuth, public navCtrl: NavController, public geolocation: Geolocation, public http: Http, private toast: ToastController, private platform: Platform, private alertCtrl: AlertController, private network: Network) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });


  }

  ionViewDidLoad() {

    this.initMap(this.mapElement.nativeElement);

  }

  ionViewDidEnter() {

    this.existingAppMarkers = [];


  }


  ionViewDidLeave() {
    this.subscriber.unsubscribe();
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  currentUser() {

    console.log(this.afAuth.auth.currentUser.email);


  }

  initMap(mapElement) {
    this.infoWindowObservable.true = 0; //is the infoWindow open
    this.geolocation.getCurrentPosition().then((position) => { //get current position

      let defaultLatLng = new google.maps.LatLng(40.4040, 60.4040); //default coords, not used.


      this.myLat = position.coords.latitude; //setting lat variable for use in other functions
      this.myLng = position.coords.longitude

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //create google maps latlng

      let mapOptions = { //setmap variables
        center: latLng,
        zoom: 14,
        maxZoom: 30,
        streetViewControl: false,
        fullscreenControl: false,
        rotateControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        clickableIcons: false,
      };

      this.map = new google.maps.Map(mapElement, mapOptions); //create google maps instance






      google.maps.event.addListenerOnce(this.map, 'idle', () => {

        this.loadThirdPartyMarkers();
        this.loadAppMarkers();


        google.maps.event.addListener(this.map, 'idle', () => {
          this.loadThirdPartyMarkers();
          this.removeMarkers();
          this.loadAppMarkers();


        });

      });


      google.maps.event.addListener(this.map, 'click', () => {

        this.thirdPartyMarkerInfoWindow.close();
        this.appInfoWindow.close();

      });

      google.maps.event.addListener(this.infoWindow, 'domready', () => {
        document.getElementById('tap').addEventListener('click', () => {



          this.infoWindowObservable.true = this.infoWindowObservable.true + 2;

          this.loadCreateNodePage();



        });


      });

      google.maps.event.addListener(this.appInfoWindow, 'domready', () => {
        document.getElementById('book').addEventListener('click', () => {

          this.navCtrl.push(NodeBookingPage, {

            param1: this.bookableNode,
            param2: this.bookableNodeId,
            param3: this.chargerType,
            param4: this.nodeOwnerId,
            param5: this.startTime,
            param6: this.finishTime,
            param7: this.afAuth.auth.currentUser.uid,
            param8: this.costPer15Mins

          });
          console.log("heyasdfuhg" + this.bookableNode)
          console.log("IDDD " + this.nodeOwnerId);
          console.log(this.costPer15Mins)



        });


        document.getElementById('open').addEventListener('click', () => {

          this.geolocation.getCurrentPosition().then((position) => {

            this.myLat = position.coords.latitude;
            this.myLng = position.coords.longitude;

          })

          window.location.href = "https://www.google.com/maps/dir/?api=1&origin=" + this.myLat + "," + this.myLng + "&destination=" + this.appLat + "," + this.appLng + "&travelMode=DRIVING"




        });




      });




      google.maps.event.addListener(this.thirdPartyMarkerInfoWindow, 'domready', () => {


        document.getElementById('directions').addEventListener('click', () => {

          this.geolocation.getCurrentPosition().then((position) => {

            this.myLat = position.coords.latitude;
            this.myLng = position.coords.longitude;

          })

          window.location.href = "https://www.google.com/maps/dir/?api=1&origin=" + this.myLat + "," + this.myLng + "&destination=" + this.thirdPartyLat + "," + this.thirdPartyLng + "&travelMode=DRIVING"




        });



      });










    },


    );




  }


  loadAppMarkers() {

    //http request for app marker data
    this.subscriber = this.http.get('http://colinfyp.bitnamiapp.com/data_marker/appMarkerData.php')
      .map(res => res.json()) //json format results
      .subscribe(appMarkers => {

        this.appMarkers = appMarkers;

        console.log("hello" + appMarkers)

        if (appMarkers == null) {
          console.log("problem");
        }
        this.addAppMarkers(appMarkers); //call the addAppMarkers function to add markers to map

      });


  }


  addAppMarkers(markers) {

    // create variables for marker details
    let costPer15Mins;
    let markerLatLng;
    let lat;
    let lng;
    let address;
    let Title;
    let AddressLine1;
    let AddressLine2;
    let Town;
    let StateOrProvince;
    let Country;
    let Membership;
    let NumberOfPoints;
    let GeneralComments;
    let Connections;
    var bookButton;
    let chargerType;
    let start;
    let finish;
    var nodeOwnerId;
    var id;

  //loop through markers and set each markers variables
    for (let marker of markers) {

      try {
        costPer15Mins = marker.costPer15Mins;
        nodeOwnerId = marker.nodeOwnerId;
        id = marker.id;
        lat = marker.lat;
        lng = marker.lng;
        Title = marker.name;
        AddressLine1 = marker.nodeAddress
        chargerType = marker.chargerType
        start = marker.startTime;
        var startFormat = start + ":00";
        finish = marker.finishTime;
        var finishFormat = finish + ":00";
        console.log("OWNER: " + nodeOwnerId);
        if (start == 0) {
          startFormat == "00:00";
        }



      }
      catch (error) {

      }
      //format address data for visible to user
      address = "<br />" + "Cost per 15 mins: €" + costPer15Mins + "<br />" + "Address: " + AddressLine1 + "<br />" + " Available from: " + startFormat + "- " + finishFormat;


      markerLatLng = new google.maps.LatLng(lat, lng);

      if (!this.markerExists(lat, lng)) {
        var image = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";

        marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: markerLatLng,
          clickable: true,
          icon: image,


        });

        var self = this; //variable used for changing scope in below listener
        bookButton = '<button id="book" style="height:45px;width:45px">Book</button>'; //create book button
        var open = '<button id="open">Open Directions In Google Maps</button>'; //button for google maps link


        //listen for when marker is clicked on map
        google.maps.event.addListener(marker, 'click', (function (marker, content, appInfoWindow, nodeAddress, id, chargerType, nodeOwnerId, start, finish, costPer15Mins, lat, lng) {
          return function () {
            appInfoWindow.setContent(bookButton + " \n \n" + content + "<br />" + open);//set info window content
            appInfoWindow.open(map, marker); //open infowindow for marker
            self.updateBookingNodeAddress(nodeAddress, id, chargerType, nodeOwnerId, start, finish, costPer15Mins, lat, lng);//call function to update variables used for loading nodeBookingPage

            self.thirdPartyMarkerInfoWindow.close(); //close thirdpartymarker infowindows, self is used to change scope of listener to set global variable




          };



        })(marker, address, this.appInfoWindow, AddressLine1, id, chargerType, nodeOwnerId, start, finish, costPer15Mins, lat, lng));






        //set marker data for markers that exist and add these to an array of existing narkers

        let markerData = {
          lat: lat,
          lng: lng,
          marker: marker
        };


        this.existingThirdPartyMarkers.push(markerData);
      }




    }
  }

  updateBookingNodeAddress(address, id, chargerType, nodeOwnerId, start, finish, costPer15Mins, lat, lng) {
    console.log(address);
    this.bookableNode = address
    this.bookableNodeId = id;
    this.chargerType = chargerType;
    this.nodeOwnerId = nodeOwnerId;
    this.startTime = start;
    this.finishTime = finish;
    this.costPer15Mins = costPer15Mins;
    this.appLat = lat;
    this.appLng = lng;
  }

  addNode() {

    if (this.addNodeClicked === true) {
      let alert = this.alertCtrl.create({
        title: 'Node Already Placed!',
        subTitle: 'Only One node can be created at a time! Please delete the current node to create another.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
            }
          },





        ]
      });

      this.map.setCenter(this.markerApp.position);
    }
    else {

      let alert = this.alertCtrl.create({
        title: 'Create A Charge Point!',
        inputs: [
          {
            name: 'address',
            placeholder: 'Charge Point Address...'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'OK',
            handler: data => {


            }
          },
          {
            text: 'Add',
            role: 'cancel',
            handler: data => {
              this.cancelClicked = 1;
              this.node.address = data.address;
            }
          }

        ]
      });
      alert.present();
      alert.onDidDismiss(() => {

        if (this.cancelClicked == 1) {

          this.geocodeAddress(this.node.address);
          this.cancelClicked = 0;
          console.log("CANCEL CLICKED");

        } else {
          console.log("CREATINE")
          this.cancelClicked = 0;



        }


      })

    }



  }



  loadThirdPartyMarkers() {

    let center = this.map.getCenter(),
      bounds = this.map.getBounds(),
      zoom = this.map.getZoom();

    // Convert to readable format
    let centerNorm = {
      lat: center.lat(),
      lng: center.lng()
    };

    let boundsNorm = {
      northEast: {
        lat: bounds.getNorthEast().lat(),
        lng: bounds.getNorthEast().lng()
      },
      southWest: {
        lat: bounds.getSouthWest().lat(),
        lng: bounds.getSouthWest().lng()
      }
    };

    let boundingRadius = this.getBoundingRadius(centerNorm, boundsNorm);


    let lng = centerNorm.lng;
    let lat = centerNorm.lat;
    this.maxDistance = boundingRadius;


    this.getThirdPartyMarkers(lng, lat, this.maxDistance);


  }


  getThirdPartyMarkers(lng, lat, maxDistance) {

    this.http.get('https://api.openchargemap.io/v2/poi/?output=json&longitude=' + lng + '&latitude=' + lat + '&distance=' + maxDistance + '&countrycode=IRL&maxresults=10')
      .map(res => res.json())
      .subscribe(thirdPartyMarkers => {


        this.addThirdPartyMarkers(thirdPartyMarkers);

      });
  }


  addThirdPartyMarkers(markers) {

    let thirdPartyMarker;
    let markerLatLng;
    let lat;
    let lng;
    let address;
    let Title;
    let AddressLine1;
    let AddressLine2;
    let Town;
    let StateOrProvince;
    let Country;
    let Membership;
    let NumberOfPoints;
    let GeneralComments;
    let Connections;

    for (let marker of markers) {

      lat = marker.AddressInfo.Latitude;
      lng = marker.AddressInfo.Longitude;
      Title = marker.AddressInfo.Title;
      AddressLine1 = marker.AddressInfo.AddressLine1;
      Town = marker.AddressInfo.Town;
      Country = marker.AddressInfo.Country.Title;
      GeneralComments = marker.GeneralComments;

      try {
        Membership = marker.UsageType.IsMembershipRequired;
        Connections = marker.Connections.ConnectionType.Title;
        NumberOfPoints = marker.NumberOfPoints;
      } catch (e) {

      }



      address = Title + ", " + AddressLine1 + ", " + Town + ", " + Country + ". Membership Required: " + Membership + " Connections: " + Connections + " Number of Points: " + NumberOfPoints + " General Comments: " + GeneralComments;


      markerLatLng = new google.maps.LatLng(lat, lng);

      if (!this.markerExists(lat, lng)) {


        marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: markerLatLng,
          clickable: true,

        });

        var self = this;
        var directions = '<button id="directions">Get Directions In Google Maps</button>';



        google.maps.event.addListener(marker, 'click', (function (marker, content, thirdPartyMarkerInfoWindow, openWindow, lat, lng) {
          return function () {

            console.log("AAAAAAAAAAAAAAA " + lat, lng);
            thirdPartyMarkerInfoWindow.setContent(content + directions);
            thirdPartyMarkerInfoWindow.open(map, marker);
            self.directions(lat, lng);
            self.appInfoWindow.close();




          };
        })(marker, address, this.thirdPartyMarkerInfoWindow, this.appInfoWindow, lat, lng));



        let markerData = {
          lat: lat,
          lng: lng,
          marker: marker
        };


        this.existingThirdPartyMarkers.push(markerData);

      }




    }
  }


  directions(lat, lng) {



    this.thirdPartyLat = lat;
    this.thirdPartyLng = lng;

  }




  closeAppInfoWIndow() {
    if (this.isInfoWindowOpen(this.appInfoWindow)) {

      this.appInfoWindow.close();
    }

  }

  markerExists(lat, lng) {

    let exists = false;

    for (let marker of this.existingThirdPartyMarkers) {
      if (marker.lat === lat && marker.lng === lng) {
        exists = true;
      }
    }

    return exists;
  }



  getBoundingRadius(center, bounds) {
    return this.getDistanceBetweenPoints(center, bounds.northEast, 'km');
  }

  getDistanceBetweenPoints(pos1, pos2, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = pos1.lat;
    let lon1 = pos1.lng;
    let lat2 = pos2.lat;
    let lon2 = pos2.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }


  /*
    addMarker() {
  
      let alert = this.alertCtrl.create({
        title: 'Create A Charging Point',
        subTitle: "Please enter the address oof the node you wish to create",
        inputs: [
          {
            name: 'address',
            placeholder: 'Node Address'
          }
        ],
        buttons: [
          {
            text: 'OK',
            role: 'OK'
          },
          {
            text: 'Cancel',
            role: 'Cancel'
          }
        ]
  
      });
  
      if (alert) {
  
      }
  
  
  
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });
  
  
  
    }
  */



  removeMarkers() {

    let center = this.map.getCenter(),
      bounds = this.map.getBounds(),
      zoom = this.map.getZoom();

    // Convert to readable format
    let centerNorm = {
      latCenter: center.lat(),
      lngCenter: center.lng()
    };

    if (this.existingThirdPartyMarkers.length > 20) {

      for (let i = 0; i < this.existingThirdPartyMarkers.length - 5; i++) {
        this.existingThirdPartyMarkers[i].marker.setMap(null)
        this.existingThirdPartyMarkers.shift(1);
        console.log(this.existingThirdPartyMarkers.length)
      }
    }
  }



  geocodeAddress(address) {

    this.markerButton = '<button id="tap">Add Charge Point</button>';
    this.deleteMarkerButton = '<button id="deleteButton">Delete</button>';
    this.geocoder = new google.maps.Geocoder();
    var iconBase = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    this.geocoder.geocode({ 'address': address }, (results, status) => {

      if (status === 'OK') {

        this.map.setCenter(results[0].geometry.location);
        this.markerApp = new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location,
          draggable: true,
          icon: iconBase,
          id: this.counter

        });

        this.addNodeClicked = true;
        this.latLngToAddress();
        this.node.address = results[0].geometry.location
        this.addMarkerButton();

        google.maps.event.addListener(this.markerApp, 'dragend', () => {
          this.loadThirdPartyMarkers();
          this.removeMarkers();
          this.latLngToAddress();
          this.addMarkerButton();
          this.disabled = false;

        });

        google.maps.event.addListener(this.markerApp, 'click', () => {


          if (this.isInfoWindowOpen(this.infoWindow)) {

          } else {
            this.infoWindow.open(this.map, this.markerApp);
          }


        });


        google.maps.event.addListener(this.infoWindow, 'closeclick', () => {


          if (this.isInfoWindowOpen(this.infoWindow)) {

          } else {
            this.infoWindow.open(this.map, this.markerApp);
          }

        });





      } else {
        let alert = this.alertCtrl.create({
          title: 'ERROR',
          subTitle: 'Node creation was unsuccesful for the following reason: ' + status,
          buttons: ['OK'],

        });

        alert.present();
        alert.onDidDismiss(() => {






        })





      }




    });

  }

  latLngToAddress() {

    var latApp = this.markerApp.position;
    var latLngApp = this.markerApp.position;



    this.geocoder = new google.maps.Geocoder();

    this.geocoder.geocode({ 'latLng': latLngApp }, (results, status) => {

      if (status === 'OK') {

        // console.log(results[0].formatted_address);

        this.node.address = results[0].formatted_address;
        this.node.lng = results[0].geometry.viewport.b.b
        this.node.lat = results[0].geometry.viewport.f.b
        this.addMarkerButton();




      } else {
        let alert = this.alertCtrl.create({
          title: 'ERROR',
          subTitle: 'Node creation was unsuccesful for the following reason:' + status,
          buttons: ['OK'],

        });

        alert.present();

      }



    });



  }

  addMarkerButton() {
    this.infoWindow.setContent("Drag the Marker to the preferred location:" + "<br />" + this.markerButton + this.deleteMarkerButton + "<br />" + this.node.address);

    if (this.isInfoWindowOpen(this.infoWindow)) {

    } else {
      this.infoWindow.open(this.map, this.markerApp);
    }




    google.maps.event.addListener(this.infoWindow, 'domready', () => {
      document.getElementById('deleteButton').addEventListener('click', () => {
        var button = document.getElementById('deleteButton');
        this.markerApp.setMap(null);


        this.disabled = false;

        this.addNodeClicked = false;




      });
    });





  }

  isInfoWindowOpen(infoWindow) {
    var map = this.infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");

  }

  loadCreateNodePage() {


    if (this.infoWindowObservable.true === 2) {
      this.navCtrl.push("CreateNodePage", {
        param1: this.node.address,
        param2: this.node.lat,
        param3: this.node.lng

      });

      this.infoWindowObservable.true = 0;

    }
  }


}