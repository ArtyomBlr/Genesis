import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ApiService } from 'src/app/core/services/api.service';
import { PeriodicElement } from 'src/app/core/models/periodic-elements.model';
import { BASE_PAGINATOR_PARAMS } from 'src/app/core/constants/paginator';

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
  public isListView = true;
  public columnsName!: string[];

  // Paginator props
  public paginationSettings$ = new BehaviorSubject(
    {pageSize: BASE_PAGINATOR_PARAMS.pageSize, pageIndex: BASE_PAGINATOR_PARAMS.pageIndex }
    );
    
  public itemsLength = 0;
  
  // List props
  public isButtonHidden = false;
  private baseStep = BASE_PAGINATOR_PARAMS.baseStep;
  private itemCount$ = new BehaviorSubject<number>(this.baseStep);

  private allPeriodicElements$: Observable<PeriodicElement[]> = this.apiService.getPeriodicElements();
  public periodicElementsList$!: Observable<PeriodicElement[]>;

  public constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.allPeriodicElements$
      .pipe(
        map((data) => Object.keys(data[0])),
        untilDestroyed(this)
      )
      .subscribe((data) => this.columnsName = data);

    this.periodicElementsList$ = combineLatest([this.allPeriodicElements$, this.paginationSettings$, this.itemCount$])
      .pipe(
          map(([elements, {pageSize, pageIndex}, itemCount]) => {
            this.itemsLength = elements.length;

            if (elements.length <= itemCount) this.isButtonHidden = true;

            if (this.isListView) return elements.slice(0, itemCount);
            
            return elements.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
          })
        )
  }

  public onPageChange = (event: PaginatorEventData): void => {
    this.paginationSettings$.next({ pageSize: event.pageSize, pageIndex: event.pageIndex });
  }

  public loadMore(): void {
    this.itemCount$.next(this.itemCount$.value + this.baseStep);
  }

  public toggleView = (): void => {
    this.isListView = !this.isListView;

    if (this.isListView) {
      this.itemCount$.next(BASE_PAGINATOR_PARAMS.baseStep);
      return;
    }
    
    this.paginationSettings$.next({ pageSize: BASE_PAGINATOR_PARAMS.pageSize, pageIndex: BASE_PAGINATOR_PARAMS.pageIndex });
  }
}
