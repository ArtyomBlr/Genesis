import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { LoaderComponent } from './components/loader/loader.component';

const materialModules = [
  MatTableModule,
  MatPaginatorModule
]
@NgModule({
  declarations: [
    LoaderComponent
  ],
  imports: [
    CommonModule,
    materialModules
  ],
  exports: [
    materialModules,
    LoaderComponent
  ]
})
export class SharedModule { }
