import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { MyEvent } from 'src/app/models/event';
import { Title } from '@angular/platform-browser';
import { myApp } from 'src/app/exports';
import { Store } from '@ngrx/store';
import { saveEvents } from 'src/app/store/actions';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  public app: string = myApp.url;
  public events: MyEvent[];
  public oneEvent: MyEvent;

  constructor(private eventsService: EventsService, private router: Router,
    private title: Title, private store: Store<any>) {
    title.setTitle("Events | Forte Gallery");
  }

  ngOnInit() {

    window.scrollTo(0, 0);
    // get events from ngrx
    let boolean = false;
    this.store.select('events').subscribe(e => {
      // if not exist get from server
      if (!e) {
        boolean = true;
        this.eventsService.getAllEvents().subscribe(events => {
          this.events = events;
          this.store.dispatch(saveEvents({ events: this.events }));
        }, err => console.log(err.message));
      }
      // if exist get from store
      if (!boolean) this.events = e;
    }, err => console.error(err.message))

  }

  public gotoEvent(id): void {
    this.oneEvent = this.events.find(
      e => e._id === id
    );
    if (this.oneEvent.activeStatus === true) {
      this.router.navigateByUrl(`/events/${this.oneEvent.eventName}`)
    }

  }

}