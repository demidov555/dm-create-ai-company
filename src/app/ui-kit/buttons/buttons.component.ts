import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'dm-button',
  template: `<button mat-button [color]="color" [disabled]="disabled">
    <ng-content></ng-content>
  </button>`,
  standalone: true,
  imports: [MatButtonModule],
})
export class UiButtonComponent {
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() disabled = false;
}
