import { EditNodeDetailsPage } from './../pages/edit-node-details/edit-node-details';
import { MyNodeCalendarPage } from './../pages/my-node-calendar/my-node-calendar';
import { MyCalendarPage } from './../pages/my-calendar/my-calendar';
import { MyProfilePage } from './../pages/my-profile/my-profile';
import { NodeEventsPage } from './../pages/node-events/node-events';
import { LoginPage } from './../pages/login/login';
import { Geolocation } from '@ionic-native/geolocation';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { MapPage } from '../pages/map/map';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './app.firebase.config';
import {AngularFireAuth } from "angularfire2/auth";
import { AngularFireModule } from "angularfire2"
import { HttpModule } from '@angular/http'
import { Network } from '@ionic-native/network';
import { NgCalendarModule  } from 'ionic2-calendar';
import { NodeBookingPage } from './../pages/node-booking/node-booking';
import { ProfilePage } from './../pages/profile/profile'; 



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    MapPage,
    TabsPage,
    NodeBookingPage,
    LoginPage,
    NodeEventsPage,
    ProfilePage,
    MyProfilePage,
    MyCalendarPage,
    MyNodeCalendarPage,
    EditNodeDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    HttpModule,
    NgCalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    MapPage,
    TabsPage,
    NodeBookingPage,
    LoginPage,
    NodeEventsPage,
    ProfilePage,
    MyProfilePage,
    MyCalendarPage,
    MyNodeCalendarPage,
    EditNodeDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
