import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

interface WebAppAdapter {
  getData() : any ;
}

declare var Android: WebAppAdapter;

interface IMeeting {
  title: string;
  startDate: string;
  endDate: string;
}

export class Room {
  roomName: string;
  currentMeeting: IMeeting;
  nextMeeting: IMeeting;
}

@Component({
  selector: 'booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.css']
})

export class BookingInfoComponent implements OnInit {
  jsonData: Room;
  constructor(private httpService: HttpClient) {
    this.jsonData = {} as Room;
  }
  isAvailable = "";
  until = "";
  nextMeeting = "";
  nextMeetingTime;
  clock;

  ngOnInit() {
    
    // this.httpService.get("../assets/data.json")
    // .subscribe(
    //   data => {
    //     this.jsonData = data as Room;
    //     this.RoomAvailability(this.jsonData);
    //   }
    // )

    var obj = JSON.parse(Android.getData());
    console.log(Android.getData());
    console.log(typeof(obj));
    console.log(obj);
    this.jsonData = obj as Room;
    console.log("this is webview talking! ");
    console.log(this.jsonData);
     
    setInterval(() => {
      this.clock = new Date().toLocaleTimeString();
    }, 1000);
  }

  RoomAvailability(data) {
    var startTime = new Date(data.currentMeeting.startDate);
    var endTime = new Date (data.currentMeeting.endDate);
    var now = new Date();
    console.log("now");
    console.log(now);
    var options = {hour: "numeric", minute: "numeric"};
    console.log(endTime, startTime, now)
    if (startTime < now && endTime > now){
      // actual meeting is going on
      this.isAvailable = "Booked until: ";
      this.until = endTime.toLocaleTimeString('UTC', options); 
    } else {
      // no meeting
      this.isAvailable = "Available until: ";
      var nextMeeting = new Date(data.nextMeeting.startDate);
      this.until = nextMeeting.toLocaleTimeString('UTC', options);
    }
    this.nextMeeting = data.nextMeeting.title;
    this.nextMeetingTime = new Date(data.nextMeeting.startDate).toLocaleTimeString('UTC', options);
  }
}
