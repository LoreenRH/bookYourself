import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

interface IMeeting {
  name: string;
  start: string;
  end: string;
}

export class Room {
  room: string;
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
  nextMeeting = {};
  nextMeetingTime;
  clock;

  ngOnInit() {
    this.httpService.get('../../assets/data.json')
    .subscribe(
      data => {
        this.jsonData =  data as Room;
        this.RoomAvailability(this.jsonData);
      },
      error => {
        console.log(error);
      }
    );
    setInterval(() => {
      this.clock = new Date().toLocaleTimeString();
    }, 1000);
  }

  RoomAvailability(data) {
    var startTime = new Date(data.currentMeeting.start);
    var endTime = new Date (data.currentMeeting.end);
    var now = new Date();
    var options = {hour: "numeric", minute: "numeric"};
    console.log(endTime, startTime, now)
    if (startTime < now && endTime > now){
      // actual meeting is going on
      this.isAvailable = "Booked until : ";
      this.until = endTime.toLocaleTimeString('UTC', options); 
    } else {
      // no meeting
      this.isAvailable = "Available until: ";
      var nextMeeting = new Date(data.nextMeeting.start);
      this.until = nextMeeting.toLocaleTimeString('UTC', options);
    }
    this.nextMeeting = data.nextMeeting;
    this.nextMeetingTime = new Date(data.nextMeeting.start).toLocaleTimeString('UTC', options);
  }
}
