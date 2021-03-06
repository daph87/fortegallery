import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ArtistsService } from 'src/app/services/artists.service';
import { Artist } from 'src/app/models/artist';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { myApp } from 'src/app/exports';
import { Store } from '@ngrx/store';
import { saveArtists } from 'src/app/store/actions';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.scss']
})
export class ArtistDetailsComponent implements OnInit {

  @ViewChild('picture', { static: false }) picture: ElementRef;
  @ViewChild('wrapper', { static: false }) modal: ElementRef;
  @ViewChild('img01', { static: false }) modalImg: ElementRef;
  @ViewChild('caption', { static: false }) captionText: ElementRef;
  @ViewChild('hiddenInput', { static: false }) hiddenInput: ElementRef;
  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  public app: string = myApp.url;
  public artist: Artist;
  public mainImgUrl: string;
  public imgUrls: string[] = [];
  public allUrls: string[] = [];
  public closeResult: string;
  public classPhotos: string;

  constructor(private activatedRoute: ActivatedRoute, private artistsService: ArtistsService,
    private title: Title, private store: Store<any>) { }

  public popup(e, artist): void {

    this.modal.nativeElement.style.display = "block";
    this.modalImg.nativeElement.src = e.target.src;
    this.displayContent(artist);
    this.hiddenInput.nativeElement.focus();

  }

  public myResume(cv): void {
    if (cv.length>1) window.open('./assets/artists-cv/' + cv);
  }

  public displayContent(artist): void {
    let valid: boolean;
    artist.imageProps.map(image => {

      if (myApp.url + '/assets/artists/' + image.fileName === this.modalImg.nativeElement.src) {
        valid = true;
        this.captionText.nativeElement.innerHTML =
          `<section>${this.picture.nativeElement.alt}</section>
          <section>${image.artWork}</section>
          <section>${image.material}</section>
          <section>${image.size}</section>
        `;
      }
    }); if (!valid) {
      this.captionText.nativeElement.innerHTML =
        `<section>${this.picture.nativeElement.alt}</section>
      <section>${this.artist.mainImageName.artWork}</section>
      <section>${this.artist.mainImageName.material}</section>
      <section>${this.artist.mainImageName.size}</section>
    `;
    }
  }

  public switchContent(): void {
    let imgPropIndex: number;
    let isMain: boolean = true;

    this.artist.imageProps.map(image => {
      if (myApp.url + '/assets/artists/' + image.fileName === this.modalImg.nativeElement.src) {
        imgPropIndex = this.artist.imageProps.indexOf(image);
        isMain = false;
      }
    });

    if (this.artist.imageProps[imgPropIndex] && !isMain)
      this.captionText.nativeElement.innerHTML =
        `<section>${this.picture.nativeElement.alt}</section>
      <section>${this.artist.imageProps[imgPropIndex].artWork}</section>
      <section>${this.artist.imageProps[imgPropIndex].material}</section>
      <section>${this.artist.imageProps[imgPropIndex].size}</section>
    `;

    else this.captionText.nativeElement.innerHTML =
      `<section>${this.picture.nativeElement.alt}</section>
      <section>${this.artist.mainImageName.artWork}</section>
      <section>${this.artist.mainImageName.material}</section>
      <section>${this.artist.mainImageName.size}</section>
    `;

  }

  public nextImg(): void {

    let currentUrl = this.modalImg.nativeElement.src;
    let indexOf: number;
    indexOf = this.allUrls.indexOf(currentUrl);
    this.displayContent(this.artist);
    if (indexOf < this.allUrls.length - 1) {
      let newUrl = this.allUrls[indexOf + 1];
      this.modalImg.nativeElement.src = newUrl;
    }
    else this.modalImg.nativeElement.src = this.allUrls[0];
    this.switchContent();
  }

  public previousImg(): void {

    let currentUrl = this.modalImg.nativeElement.src;
    let indexOf: number;
    indexOf = this.allUrls.indexOf(currentUrl);
    this.displayContent(this.artist);
    if (indexOf > 0) {
      let newUrl = this.allUrls[indexOf - 1];
      this.modalImg.nativeElement.src = newUrl;
    }
    else this.modalImg.nativeElement.src = this.allUrls[this.allUrls.length - 1];
    this.switchContent();
  }

  public closePopup() {
    this.modal.nativeElement.style.display = "none";
  }

  ngOnInit() {

    window.scrollY == 0;
    const fullName = this.activatedRoute.snapshot.params.fullName;
    this.title.setTitle(fullName + " | Forte Gallery");
    // get from redux
    let boolean = false;
    this.store.select('artists').subscribe(a => {
      // if doesn t exist in redux
      if (!a) {
        boolean = true;
        this.artistsService.getAllArtists().subscribe(artists => {
          this.getArtist(artists, fullName);
          this.store.dispatch(saveArtists({ artists }));
        });
      }

      // if exists on redux
      if (!boolean) this.getArtist(a, fullName);
    })
  }

  private getArtist(artists, fullName): void {
    this.artist = artists.find(
      a => a.fullName === fullName
    );

    this.mainImgUrl = myApp.url + "/assets/artists/" + this.artist.mainImageName.fileName;
    this.allUrls.push(this.mainImgUrl);

    this.artist.imageProps.map(obj => {
      this.imgUrls.push(myApp.url + "/assets/artists/" + obj.fileName);
      this.allUrls.push(myApp.url + "/assets/artists/" + obj.fileName);
    });

    if (this.artist.imageProps.length < 7 && this.artist.imageProps.length > 3) {
      this.classPhotos = "fewPictures";
    }

    else if (this.artist.imageProps.length <= 3) {
      this.classPhotos = "oneColumnPictures";
    }
    else {
      this.classPhotos = "photos";
    }
  }


}


