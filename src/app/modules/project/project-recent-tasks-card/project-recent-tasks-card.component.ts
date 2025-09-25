import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-project-recent-tasks-card',
  templateUrl: './project-recent-tasks-card.component.html',
  styleUrls: ['./project-recent-tasks-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
  ],
})
export class ProjectRecentTasksCardComponent implements OnInit {
  displayedColumns = ['task', 'assignedTo', 'status', 'dueDate', 'actions'];

  tasks = [
    {
      title: 'Implement product listing page',
      description: 'Frontend development',
      assignee: 'AI Frontend Dev',
      avatarColor: 'blue',
      status: 'Completed',
      statusColor: 'green',
      dueDate: 'Jun 5, 2023',
    },
    {
      title: 'Create API endpoints for products',
      description: 'Backend development',
      assignee: 'AI Backend Dev',
      avatarColor: 'green',
      status: 'Completed',
      statusColor: 'green',
      dueDate: 'Jun 6, 2023',
    },
  ];
  constructor() {}

  ngOnInit() {}
}
