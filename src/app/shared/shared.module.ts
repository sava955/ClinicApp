import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { AngularMaterialModule } from './angular-material.modulet';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SideNavbarComponent, TopNavbarComponent],
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModule, RouterModule],
  exports: [ReactiveFormsModule, SideNavbarComponent, TopNavbarComponent],
})
export class SharedModule {}
