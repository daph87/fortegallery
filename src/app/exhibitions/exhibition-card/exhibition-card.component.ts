import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Exhibition } from 'src/app/models/exhibition';
import { ExhibitionsService } from 'src/app/services/exhibitions.service';
import { Title } from '@angular/platform-browser';
import { myApp } from 'src/app/exports';
import { saveExhibitions } from 'src/app/store/actions';
import { Store } from '@ngrx/store';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-exhibition-card',
  templateUrl: './exhibition-card.component.html',
  styleUrls: ['./exhibition-card.component.scss']
})
export class ExhibitionCardComponent implements OnInit {
  public app: string = myApp.url;
  @ViewChild('picture', { static: false }) picture: ElementRef;
  @ViewChild('wrapper', { static: false }) modal: ElementRef;
  @ViewChild('img01', { static: false }) modalImg: ElementRef;
  @ViewChild('hiddenInput', { static: false }) hiddenInput: ElementRef;
  public myExhibition: Exhibition;
  public mainImgUrl: string;
  public imgUrls: string[] = [];
  public allUrls: string[] = [];
  public closeResult: string;

  constructor(private activatedRoute: ActivatedRoute, private exhibitionService: ExhibitionsService,
    private title: Title, private store: Store<any>, private modalService: NgbModal) {
    title.setTitle("Exhibitions | Forte Gallery");
  }

  ngOnInit() {

    const exhibitionName = this.activatedRoute.snapshot.params.exhibition;
    window.scrollTo(0, 0);

    // get exhibitions from store
    let boolean = false;
    this.store.select('exhibitions').subscribe(es => {

      // if not exist get from store
      if (!es) {
        boolean = true;
        this.exhibitionService.getAllExhibitions().subscribe(exhibitions => {
          this.store.dispatch(saveExhibitions({ exhibitions: exhibitions }));
          this.findExhibition(exhibitions, exhibitionName);
        }, err => console.log(err.message));
      }

      // if exist get from store
      if (!boolean) this.findExhibition(es, exhibitionName);

    }, err => console.error(err.message));

  }

  private findExhibition(exhibitions, exhibitionName): void {
    exhibitions.map(exhibition => {
      if (exhibition.exhibitionName === exhibitionName) {
        this.myExhibition = exhibition;

        this.mainImgUrl = myApp.url + "/assets/exhibitions/" + this.myExhibition.exhibitionDetailsImageCover.fileName;
        this.allUrls.push(this.mainImgUrl);

        this.myExhibition.exhibitionImages.map(obj => {
          this.imgUrls.push(myApp.url + "/assets/exhibitions/" + obj.fileName);
          this.allUrls.push(myApp.url + "/assets/exhibitions/" + obj.fileName);
        });
      }

    });
  }

  public getArtistUrl(artist): string {
    return artist.existArtsist ? `/artists/${artist.artist}` : `/exhibitions/${this.myExhibition.exhibitionName}`;
  }

  public artistNameHover(artist): string {
    return artist.existArtsist ? `exist` : ``;
  }

  public nextImg(): void {

    let currentUrl = this.modalImg.nativeElement.src;
    let indexOf: number;
    indexOf = this.allUrls.indexOf(currentUrl);

    if (indexOf < this.allUrls.length - 1) {
      let newUrl = this.allUrls[indexOf + 1];
      this.modalImg.nativeElement.src = newUrl;
    }
    else this.modalImg.nativeElement.src = this.allUrls[0];

  }


  public previousImg(): void {

    let currentUrl = this.modalImg.nativeElement.src;
    let indexOf: number;
    indexOf = this.allUrls.indexOf(currentUrl);
    if (indexOf > 0) {
      let newUrl = this.allUrls[indexOf - 1];
      this.modalImg.nativeElement.src = newUrl;
    }
    else this.modalImg.nativeElement.src = this.allUrls[this.allUrls.length - 1];
  }

  public closePopup() {
    this.modal.nativeElement.style.display = "none";
  }

  public popup(e): void {

    this.modal.nativeElement.style.display = "block";
    this.modalImg.nativeElement.src = e.target.src;
    this.hiddenInput.nativeElement.focus();
  }

  // exit from the about modal
  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // open about modal
  public open(content): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}