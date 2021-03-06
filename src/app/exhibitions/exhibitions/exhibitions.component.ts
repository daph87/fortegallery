import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExhibitionsService } from 'src/app/services/exhibitions.service';
import { Exhibition } from 'src/app/models/exhibition';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { myApp } from 'src/app/exports';
import { Store } from '@ngrx/store';
import { saveExhibitions } from 'src/app/store/actions';

@Component({
  selector: 'app-exhibitions',
  templateUrl: './exhibitions.component.html',
  styleUrls: ['./exhibitions.component.scss']
})
export class ExhibitionsComponent implements OnInit {
  public app: string = myApp.url;
  @ViewChild('default', { static: false }) default: ElementRef;

  public exhibitions: Exhibition[];


  constructor(private exhibitionService: ExhibitionsService, private router: Router, private title: Title,
    private store: Store<any>) {
    title.setTitle("Exhibitions | Forte Gallery");
  }

  ngOnInit() {

    window.scrollTo(0, 0);
    // get exhibitions from ngrx
    let boolean = false;
    this.store.select('exhibitions').subscribe(es => {
      if (!es) {
        boolean = true;
        this.exhibitionService.getAllExhibitions().subscribe(exhibitions => {
          this.exhibitions = exhibitions;
          this.store.dispatch(saveExhibitions({ exhibitions: this.exhibitions }));
        }, err => console.log(err.message));
      }
      if (!boolean) this.exhibitions = es;
    }, err => console.error(err.message));

  }

  public gotoExhibition(name): void {
    this.exhibitions.map(exhibition => {
      if (exhibition.exhibitionName === name) this.router.navigateByUrl(`/exhibitions/${exhibition.exhibitionName}`)
    });
  }

}