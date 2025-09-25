import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ProjectStatusCardComponent } from '../../modules/project/project-status-card/project-status-card.component';
import { ProjectTeamCardComponent } from '../../modules/project/project-team-card/project-team-card.component';
import { ProjectDetailsCardComponent } from '../../modules/project/project-details-card/project-details-card.component';
import { ProjectRecentTasksCardComponent } from '../../modules/project/project-recent-tasks-card/project-recent-tasks-card.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProjectStatusCardComponent,
    ProjectTeamCardComponent,
    ProjectDetailsCardComponent,
    ProjectRecentTasksCardComponent,
  ],
})
export class ProjectComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    const projectId = Number(this.activatedRoute.snapshot.queryParams['wh_id']);
  }
}
