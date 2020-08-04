import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CarouselPicturesService } from 'src/app/services/carousel-pictures.service';
import { myApp } from 'src/app/exports';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  public app: string = myApp.url;
  public carouselPictures = undefined;

  constructor(private CarouselPicturesService: CarouselPicturesService, config: NgbCarouselConfig) {
    config.interval = 4000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationIndicators = false;
    config.showNavigationArrows = false;
  }
  ngOnInit() {

    this.CarouselPicturesService.getAllCarouselPictures()
      .subscribe(carouselPictures => this.carouselPictures = carouselPictures)

  }

}