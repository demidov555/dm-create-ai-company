import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, MatIconModule, MatListModule],
})
export class SidebarComponent implements OnInit {
  projects = [
    {
      name: '1',
      description: 'qwe',
    },
  ];
  constructor() {}

  ngOnInit() {}
}
