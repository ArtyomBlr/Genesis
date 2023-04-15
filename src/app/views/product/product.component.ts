import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, switchMap } from 'rxjs';

import { ApiService } from 'src/app/core/services/api.service';
import { PeriodicElement } from 'src/app/core/models/periodic-elements.model';

interface PaginatorEvent {
  pageIndex: number;
  pageSize: number;
}
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {
  public pageIndex = 0;
  public pageSize = 10;
  public length = 0;
  
  public paginationSettings$ = new BehaviorSubject({pageSize: this.pageSize, pageIndex: this.pageIndex });

  public periodicElements$: Observable<PeriodicElement[]> = this.apiService.getRegion();
  public currentPeriodicElements$!: Observable<PeriodicElement[]>;

  public displayedColumns$: Observable<string[]> = this.periodicElements$.pipe(
    map((data) => Object.keys(data[0]))
  );

  public constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.currentPeriodicElements$ = this.periodicElements$.pipe(
      switchMap((data: any) => {
        return combineLatest([this.periodicElements$, this.paginationSettings$])
          .pipe(
            map(([elements, {pageSize, pageIndex}]) => {
              this.length = data.length;
              return elements.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
            })
          )
      })
    )
  }

  public onPageChange(event: PaginatorEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.paginationSettings$.next({ pageSize: this.pageSize, pageIndex: this.pageIndex });
  }
}
