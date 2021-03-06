import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Publication } from 'src/app/models/publication';
import { PublicationsService } from 'src/app/services/publications.service';
import { Title } from '@angular/platform-browser';
import { myApp } from 'src/app/exports';
import { Store } from '@ngrx/store';
import { savePublication } from 'src/app/store/actions';


@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {
  public app: string = myApp.url;
  public publications: Publication[]
  constructor(private publicationsService: PublicationsService, private router: Router,
    private title: Title, private store: Store<any>) {
    title.setTitle("Publications | Forte Gallery");
  }

  ngOnInit() {

    window.scrollTo(0, 0);
    // get publications from ngrx
    let boolean = false;
    this.store.select('publications').subscribe(ps => {
      // if not exist get from server
      if (!ps) {
        boolean = true;
        this.publicationsService.getAllPublications().subscribe(publications => {
          this.publications = publications;
          this.store.dispatch(savePublication({ publications: this.publications }));
        }, err => console.log(err.message));
      }
      // if exist get from store
      if (!boolean) this.publications = ps;
    }, err => console.error(err.message));

  }

  public gotoPublication(publication): void {
    this.router.navigateByUrl(`/publications/${publication.bookName}`)
  }

}