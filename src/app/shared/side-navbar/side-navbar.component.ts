import { Component, OnInit } from '@angular/core';
import { NAV_ICONS } from '../../core/enums/nav.enum';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
})
export class SideNavbarComponent implements OnInit {
  links = [
    { path: 'home', label: 'Home' },
    { path: 'new-patient', label: 'New Patent' },
    { path: 'list-patients', label: 'List Patients' },
  ];
  navIcons = NAV_ICONS;

  constructor() {}

  ngOnInit(): void {}
}
