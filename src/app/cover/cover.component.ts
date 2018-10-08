import { Component, OnInit } from '@angular/core';
import { CoverService } from '@core';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})
export class CoverComponent implements OnInit {
  coverstate: string;
  constructor( private cover: CoverService) { }

  ngOnInit() {
    this.coverstate = this.cover.isCover();
  }

}
