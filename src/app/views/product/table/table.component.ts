import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PeriodicElement } from 'src/app/core/models/periodic-elements.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() elements!: PeriodicElement[];
  @Input() columns!: string[];
}
