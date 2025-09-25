import { Routes } from '@angular/router';
import { CommonLayoutComponent } from './layout/common-layout/common-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: [
      {
        path: 'project/:id',
        loadComponent: () =>
          import('./pages/project/project.component').then(
            (c) => c.ProjectComponent
          ),
      },
    ],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
];
