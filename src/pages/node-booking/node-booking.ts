import { NodeEventsPage } from './../node-events/node-events';
import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { MonthViewComponent } from 'ionic2-calendar/monthview';
import { WeekViewComponent } from 'ionic2-calendar/weekview';
import { DayViewComponent } from 'ionic2-calendar/dayview';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Subscription } from 'rxjs/Subscription';
import {LoadingController} from 'ionic-angular';




/**
 * Generated class for the NodeBookingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-node-booking',
  templateUrl: 'node-booking.html',
})
export class NodeBookingPage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  isToday: boolean;
  startHour: any;
  endHour: any;
  nodeAddress: any;
  nodeId: any;
  chargerType: any;
  nodeOwnerId;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    startHour: 1,
    endHour: 24,
    step: 30,

  };
  userId: any;
  eventsStart = [];
  eventsFinish = [];
  costPer15Mins: any;
  
  constructor(public loadingCtrl: LoadingController, public http: Http, public navParams: NavParams, navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController) {

    
    this.eventSource = [];
    this.nodeAddress = navParams.get('param1');
    this.nodeId = navParams.get('param2');
    this.chargerType = navParams.get('param3');
    this.nodeOwnerId = navParams.get('param4');
    this.startHour = navParams.get('param5');
    this.endHour = navParams.get('param6');
    this.userId = navParams.get('param7');
    this.costPer15Mins = navParams.get('param8');
    console.log("STTTARTHOUR"+ this.startHour);
    console.log(this.userId);
    this.loadCalendar()




      let loading = this.loadingCtrl.create({
        content: 'Loading Node Data...'
      });
    
      loading.present();
    
      setTimeout(() => {
        this.calendar.mode = 'week';
       
      
        
        loading.dismiss();

      

      }, 100);
    
    
 

    

    


  }

  ionViewDidEnter(){
   console.log("HHHHHHHHHEEEEEEEEEEEEEEYYYYOOOOOOOO")
  }
  ionViewDidLoad() {

 
  }
  
 loadCalendar(){
    
    
  let events = this.eventSource;
  this.http.get('http://colinfyp.bitnamiapp.com/data_marker/getNodeBookings.php?nodeId=' + this.nodeId )
  .map(res => res.json())
  .subscribe(nodeBookings => {

    
    if (nodeBookings) {
     

      for (let eventData of nodeBookings) {

     




        var mysqlDateTimeStart = eventData.startTime.split(/[- :]/);

        // Apply each element to the Date function
        var javascriptDateTimeStart = new Date(mysqlDateTimeStart[0], mysqlDateTimeStart[1]-1, mysqlDateTimeStart[2], mysqlDateTimeStart[3], mysqlDateTimeStart[4], mysqlDateTimeStart[5]);


        var mysqlDateTimefinish = eventData.finishTime.split(/[- :]/);

        // Apply each element to the Date function
        var javascriptDateTimefinish = new Date(mysqlDateTimefinish[0], mysqlDateTimefinish[1]-1, mysqlDateTimefinish[2], mysqlDateTimefinish[3], mysqlDateTimefinish[4], mysqlDateTimefinish[5]);
        
        console.log(javascriptDateTimefinish);


      eventData.startTime = new Date(javascriptDateTimeStart);
      eventData.endTime = new Date(javascriptDateTimefinish);

      eventData.title = "Booking ID: "+ eventData.bookingId + ". User: " +eventData.userFirstName + " " + eventData.userLastName +  ". " + "Charger Type: " +this.chargerType + ". " ;
      console.log(eventData.title);

        
      this.eventSource.push(eventData);
      this.eventsStart.push(eventData.startTime);
      this.eventsFinish.push(eventData.endTime);
     
   
   
   
    }
  }
  else 
  return 0;
    if (nodeBookings == null) {
      console.log("problem");
    }
 

  });
 }
  

addEvent() {
  
    let modal = this.modalCtrl.create(NodeEventsPage, { selectedDay: this.selectedDay, nodeAddress: this.nodeAddress, chargerType: this.chargerType, nodeOwnerId: this.nodeOwnerId, nodeId: this.nodeId, userId: this.userId, eventsStart: this.eventsStart, eventsFinish: this.eventsFinish, costPer15Mins: this.costPer15Mins, startHour: this.startHour, endHour: this.endHour });

    modal.present();
    modal.onDidDismiss(data => {

      

      if(data){
      let alert = this.alertCtrl.create({
        title: 'Great!',
        subTitle: 'Your Booking Was Successful',
        buttons: ['OK']
      });

      this.loadCalendar();
      this.changeMode("month");
   
      alert.present();
     
    }
   
      if (data) {
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.changeMode("week");
          console.log(this.eventSource);
        
        });
      }
    });
  }





  click(){
    var elem: HTMLElement = document.elementFromPoint(300, 200) as HTMLElement;
    elem.click();
  }



  

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }

  changeMode(mode) {
    this.calendar.mode = mode;
    console.log(this.calendar.mode)
  }



  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }





} 