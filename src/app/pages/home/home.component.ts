import { APP_BASE_HREF, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HeaderComponent } from '../../layout/header/header.component';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatProgressBarModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
  ],
})
export class HomeComponent implements OnInit {
  projects = [
    {
      id: '1',
      name: 'Веб-сайт электронной коммерции v2',
      description:
        'Разработка новой версии платформы электронной коммерции с улучшенными функциями.',
      manager: 'AI Агент Оптимус',
      status: 'active',
      progress: 75,
    },
    {
      id: '2',
      name: 'Мобильное приложение для управления проектами',
      description:
        'Создание мобильного приложения для упрощения управления задачами в пути.',
      manager: 'AI Агент Квант',
      status: 'waiting',
      progress: 20,
    },
    {
      id: '3',
      name: 'Система управления контентом',
      description:
        'Внедрение новой CMS для более эффективного управления контентом веб-сайта.',
      manager: 'AI Агент Вега',
      status: 'done',
      progress: 100,
    },
    {
      id: '4',
      name: 'Инструмент аналитики данных',
      description:
        'Разработка инструмента для анализа больших объемов данных и генерации отчетов.',
      manager: 'AI Агент Зета',
      status: 'active',
      progress: 50,
    },
    {
      id: '5',
      name: 'Платформа для онлайн-обучения',
      description:
        'Создание интерактивной платформы для дистанционного обучения и курсов.',
      manager: 'AI Агент Альфа',
      status: 'active',
      progress: 90,
    },
    {
      id: '6',
      name: 'Умный дом: Управление устройствами',
      description:
        'Интеграция различных устройств умного дома в единую систему управления.',
      manager: 'AI Агент Кибер',
      status: 'waiting',
      progress: 10,
    },
    {
      id: '7',
      name: 'Система бронирования авиабилетов',
      description:
        'Разработка новой системы для быстрого и удобному бронирования авиабилетов.',
      manager: 'AI Агент Протон',
      status: 'active',
      progress: 60,
    },
    {
      id: '8',
      name: 'Платформа для управления событиями',
      description:
        'Инструмент для планирования, организации и проведения онлайн и офлайн событий.',
      manager: 'AI Агент Нова',
      status: 'done',
      progress: 100,
    },
  ];

  private router = inject(Router);

  ngOnInit() {}

  goToProjectPage(id: string): void {
    this.router.navigate([`/project/${id}`]);
  }
}
