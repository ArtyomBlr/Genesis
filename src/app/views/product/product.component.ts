import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ApiService } from 'src/app/core/services/api.service';
import { PeriodicElement } from 'src/app/core/models/periodic-elements.model';

interface PaginatorEventData {
  pageIndex: number;
  pageSize: number;
}

@UntilDestroy()
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnInit {
  public isListView = false;
  public columnsName!: string[];

  // Paginator props
  public pageIndex = 0;
  public pageSize = 10;
  public itemsLength = 0; 

  private paginationSettings$ = new BehaviorSubject(
      {pageSize: this.pageSize, pageIndex: this.pageIndex }
    );
  
  // List props
  public isButtonHidden = false;
  private baseStep = 10;
  private itemCount$ = new BehaviorSubject<number>(this.baseStep);

  private periodicElements$: Observable<PeriodicElement[]> = this.apiService.getRegion()

  public paginatedPeriodicElements$!: Observable<PeriodicElement[]>;
  public loadedPeriodicElements$!: Observable<PeriodicElement[]>; 

  public constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // TODO: think how can I optimize it
    this.periodicElements$
      .pipe(
        map((data) => Object.keys(data[0])),
        untilDestroyed(this)
      )
      .subscribe((data) => this.columnsName = data);

    this.paginatedPeriodicElements$ = combineLatest([this.periodicElements$, this.paginationSettings$])
      .pipe(
          map(([elements, {pageSize, pageIndex}]) => {
            this.itemsLength = elements.length;

            return elements.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
          })
        )

    this.loadedPeriodicElements$ = 
      combineLatest([this.periodicElements$, this.itemCount$])
        .pipe(
          map(([elements, itemCount]) => {
            if (elements.length <= itemCount) this.isButtonHidden = true;
            
            return elements.slice(0, itemCount);
          })
        )
  }

  public onPageChange = (event: PaginatorEventData): void => {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.paginationSettings$.next({ pageSize: this.pageSize, pageIndex: this.pageIndex });
  }

  public loadMore(): void {
    this.itemCount$.next(this.itemCount$.value + this.baseStep);
  }

  public toggleView = (): void => {
    this.isListView = !this.isListView;
  }
}
