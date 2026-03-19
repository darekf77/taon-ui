import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'taon-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './taon-not-found.component.html',
  styleUrls: ['./taon-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaonNotFoundComponent {}
