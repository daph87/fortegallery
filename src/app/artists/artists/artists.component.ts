import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ArtistsService } from 'src/app/services/artists.service';
import { Artist } from 'src/app/models/artist';
import { Title } from '@angular/platform-browser';
import { myApp } from 'src/app/exports';
import { Store } from '@ngrx/store';
import { saveArtists } from 'src/app/store/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {
  public app: string = myApp.url;
  public artists: Artist[] = [];

  public sortedArtistsNames: string[] = [];
  public worksArtists: Artist[] = [];
  public representedArtists: Artist[] = [];

  public imgUrl: string;

  constructor(private artistsService: ArtistsService, private title: Title, private store: Store<any>,
    private router: Router) {
    title.setTitle("Artists Archieve | Forte Gallery");
  }

  ngOnInit() {
    
    window.scrollTo(0, 0);
    let boolean = false;
    // check if artists exist in the store
    this.store.select('artists').subscribe(artists => {
      if (!artists) {
          boolean = true;
          this.artistsService.getAllArtists().subscribe(ats => {

          // save artists in NgRX
          this.getAllArtists(ats);
          this.store.dispatch(saveArtists({ artists: ats }));

        }, err => console.error(err.message));
      }
      if (!boolean) this.getAllArtists(artists);
      
    }, err => console.error(err.message));

  }

  private getAllArtists(artists: Artist[]): void {
    this.artists = [];
    artists.map(artist => this.sortedArtistsNames.push(artist.fullName));
    this.sortedArtistsNames = this.sortedArtistsNames.sort();

    this.sortedArtistsNames.map(name => {
      this.artists.push(artists.find(artist => artist.fullName === name))
    });

    this.artists.map(artist => {
      if (artist.status === 'Works') this.worksArtists.push(artist);
      else this.representedArtists.push(artist);
    });
  }

  public pictureAppears(artistName) {
    this.artists.map(artist => {
      if (artistName === artist.fullName)
        this.imgUrl = this.app + "/assets/artists/" + artist.mainImageName.fileName;
    }, err => console.error(err.message));

  }

  public pictureDissapears() {
    this.imgUrl = undefined
  }


}