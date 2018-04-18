import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

interface WebAppAdapter {
  getData() : any ;
}

declare var Android: WebAppAdapter;

@Component({
  selector: 'booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.css']
})

export class BookingInfoComponent implements OnInit {
  jsonData: Object;
  constructor(private httpService: HttpClient) {
    this.jsonData = {} as Object;
  }
  roomName = ""
  currentMeetingName = "";
  isAvailable = "";
  until = "";
  nextMeeting = "";
  nextMeetingTime;
  clock;

  ngOnInit() {
    // var json = {"currentMeeting":{"endDate":"2018-04-18T15:00:00.000+02:00","startDate":"2018-04-18T14:00:00.000+02:00","title":"Recurring Important Meeting"},"lastUpdated":"2018-04-18T12:26:03.949Z","nextMeeting":{"endDate":"2018-04-25T15:00:00.000+02:00","startDate":"2018-04-25T14:00:00.000+02:00","title":"Recurring Important Meeting"},"roomId":"docker.com_jbfd49h727i9p1umat92sm4vkg@group.calendar.google.com","roomName":"Fake Pinata"}
    // var str = JSON.stringify(json);
    
    // this.RoomAvailability(JSON.parse(str));
    // this.jsonData = obj;
    
    setInterval(() => {
      this.RoomAvailability(JSON.parse(Android.getData()));
    }, 3000);
    

    setInterval(() => {
      this.clock = new Date().toLocaleTimeString();
    }, 1000);
  }

  RoomAvailability(data) {
    
    var now = new Date();
    console.log(now);
    this.roomName = data.roomName;
    var options = {hour: "numeric", minute: "numeric"};
    // check if there's a current meeting
    if (data.hasOwnProperty('currentMeeting')){
      this.currentMeetingName = data.currentMeeting.title;
      var endTime = new Date (data.currentMeeting.endDate);
      this.isAvailable = "Booked until: ";
      this.until = endTime.toLocaleTimeString('GMT', options);
    } else {
      // no meeting
      var nextMeeting = new Date(data.nextMeeting.startDate);
      console.log(nextMeeting.toLocaleDateString() +"!=" + now.toLocaleDateString());
      if(nextMeeting.toLocaleDateString() != now.toLocaleDateString()){

        this.isAvailable = "Available";
        this.until = "";
      } else {
        this.isAvailable = "Available until: ";
        this.until = nextMeeting.toLocaleTimeString('GMT', options);
      }
    }
    if (data.hasOwnProperty('nextMeeting')) {
      console.log(data.nextMeeting);
      var nextMeetingStart = new Date(data.nextMeeting.startDate);
      if (nextMeetingStart.toLocaleDateString() != now.toLocaleDateString()) {
        this.nextMeeting = "No more meetings today";
        this.nextMeetingTime = "";
      } else {
        this.nextMeeting = data.nextMeeting.title;
        this.nextMeetingTime = nextMeetingStart.toLocaleTimeString('UTC', options);
      }
    } else {
      this.nextMeeting = "No more meetings today";
      this.nextMeetingTime = "";
    }

    // this.nextMeeting = data.nextMeeting.title;
    // this.nextMeetingTime = new Date(data.nextMeeting.startDate).toLocaleTimeString('UTC', options);
  }
}

