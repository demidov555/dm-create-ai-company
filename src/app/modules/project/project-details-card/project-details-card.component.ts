import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-project-details-card',
  templateUrl: './project-details-card.component.html',
  styleUrls: ['./project-details-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatIconModule],
})
export class ProjectDetailsCardComponent implements OnInit {
  phases = [
    { name: 'Planning', duration: '2 days', progress: 100, color: 'primary' },
    { name: 'Development', duration: '5 days', progress: 75, color: 'accent' },
    { name: 'Testing', duration: '2 days', progress: 30, color: 'warn' },
    { name: 'Deployment', duration: '1 day', progress: 0, color: 'primary' },
  ];

  constructor() {}

  ngOnInit() {}
}
