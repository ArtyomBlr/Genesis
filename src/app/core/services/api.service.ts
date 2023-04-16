import { Injectable } from '@angular/core';
import { Observable, of, shareReplay, switchMap, timer } from 'rxjs';

import { PeriodicElement } from '../models/periodic-elements.model';
import { ELEMENT_DATA } from '../constants/periodic-elements';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public getPeriodicElements = (): Observable<PeriodicElement[]> =>
    timer(1000)
      .pipe(
        switchMap(() => 
          of([...ELEMENT_DATA]),
        ),
        shareReplay({ bufferSize: 1, refCount: false })
      );
}
