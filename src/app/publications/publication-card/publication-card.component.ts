import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationsService } from 'src/app/services/publications.service';
import { Publication } from 'src/app/models/publication';
import { Title } from '@angular/platform-browser';
import { myApp } from 'src/app/exports';
import { Store } from '@ngrx/store';
import { savePublication } from 'src/app/store/actions';

@Component({
  selector: 'app-publication-card',
  templateUrl: './publication-card.component.html',
  styleUrls: ['./publication-card.component.scss']
})
export class PublicationCardComponent implements OnInit {
  public app: string = myApp.url;
  public publication: Publication;
  public imgUrls: string[] = [];
  @ViewChild('wrapper', { static: false }) modal: ElementRef;
  @ViewChild('img01', { static: false }) modalImg: ElementRef;
  @ViewChild('hiddenInput', { static: false }) hiddenInput: ElementRef;

  constructor(private publicationsService: PublicationsService, private activatedRoute: ActivatedRoute,
    private title: Title, private store: Store<any>) { }

  ngOnInit() {

    window.scrollTo(0, 0);
    const bookName = this.activatedRoute.snapshot.params.publication;
    this.title.setTitle(bookName + " | Forte Gallery");
    // get publications from store
    let boolean = false;
    this.store.select('publications').subscribe(ps => {

      // if not exist get from server
      if (!ps) {
        boolean = true;
        this.publicationsService.getAllPublications().subscribe(publications => {
          this.store.dispatch(savePublication({ publications: publications }));
          this.findPublication(publications, bookName);
        }, err => console.log(err.message));
      }

      // if exist get from store
      if (!boolean) this.findPublication(ps, bookName);

    }, err => console.error(err.message));
  }

  // find the current publication from all publications
  private findPublication(publications, bookName): void {
    publications.map(publication => {
      if (publication.bookName === bookName) {
        this.publication = publication;
        this.publication.allImages.map(obj => {
          this.imgUrls.push(myApp.url + "/assets/publications/" + obj.fileName);
        });
      }
    })
  }

  public nextImg(): void {

    let currentUrl = this.modalImg.nativeElement.src;
    let indexOf: number;
    indexOf = this.imgUrls.indexOf(currentUrl);

    if (indexOf < this.imgUrls.length - 1) {
      let newUrl = this.imgUrls[indexOf + 1];
      this.modalImg.nativeElement.src = newUrl;
    }
    else this.modalImg.nativeElement.src = this.imgUrls[0];

  }

  public previousImg(): void {

    let currentUrl = this.modalImg.nativeElement.src;
    let indexOf: number;
    indexOf = this.imgUrls.indexOf(currentUrl);
    if (indexOf > 0) {
      let newUrl = this.imgUrls[indexOf - 1];
      this.modalImg.nativeElement.src = newUrl;
    }
    else this.modalImg.nativeElement.src = this.imgUrls[this.imgUrls.length - 1];
  }

  public closePopup() {
    this.modal.nativeElement.style.display = "none";
  }

  public popup(e): void {
    this.modal.nativeElement.style.display = "block";
    this.modalImg.nativeElement.src = e.target.src;
    this.hiddenInput.nativeElement.focus();
  }

}