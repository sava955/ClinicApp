import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {
  private subscriptions$ = new Subscription();
  @Output() sidenavToggled = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  toggleSideNav(): void {
    this.sidenavToggled.emit();
  }

}
