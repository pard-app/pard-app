import { Component, OnInit } from "@angular/core";
import { PhotoService } from "../../features/services/photo.service";

@Component({
  selector: "app-listings",
  templateUrl: "./listings.page.html",
  styleUrls: ["./listings.page.scss"]
})
export class ListingsPage implements OnInit {
  constructor(public photoService: PhotoService) {}

  ngOnInit() {}
}
