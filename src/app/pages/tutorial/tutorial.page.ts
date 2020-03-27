import { Component, OnInit, ViewChild } from "@angular/core";
import { IonSlides } from "@ionic/angular";

@Component({
  selector: "app-tutorial",
  templateUrl: "./tutorial.page.html",
  styleUrls: ["./tutorial.page.scss"]
})
export class TutorialPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  slideOpts = {
    initialSlide: 0
  };

  constructor() {}

  ngOnInit() {}

  nextSlide() {
    this.slides.slideNext();
  }
}
