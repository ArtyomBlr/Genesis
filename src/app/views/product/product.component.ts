import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, switchMap } from 'rxjs';

import { ApiService } from 'src/app/core/services/api.service';
import { PeriodicElement } from 'src/app/core/models/periodic-elements.model';

interface PaginatorEventData {
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
  public view: string = 'list';

  public pageIndex = 0;
  public pageSize = 10;
  public length = 0;
  
  public paginationSettings$ = new BehaviorSubject({pageSize: this.pageSize, pageIndex: this.pageIndex });

  public periodicElements$: Observable<PeriodicElement[]> = this.apiService.getRegion();
  public paginatedPeriodicElements$!: Observable<PeriodicElement[]>;

  public displayedColumns$: Observable<string[]> = this.periodicElements$.pipe(
    map((data) => Object.keys(data[0]))
  );

  public constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.paginatedPeriodicElements$ = this.periodicElements$.pipe(
      switchMap((data: PeriodicElement[]) => {
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

  public onPageChange(event: PaginatorEventData): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.paginationSettings$.next({ pageSize: this.pageSize, pageIndex: this.pageIndex });
  }

  public toggleView(): void {
    this.view = this.view === 'list'? 'paginator' : 'list';
  }
}
