import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-project-team-card',
  templateUrl: './project-team-card.component.html',
  styleUrls: ['./project-team-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
    imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
})
export class ProjectTeamCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
