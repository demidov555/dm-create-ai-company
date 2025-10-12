import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ProjectCommonChatApiService } from './project-common-chat-api.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-project-common-chat',
  templateUrl: './project-common-chat.component.html',
  styleUrls: ['./project-common-chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,

    MatButtonModule,
    MatInputModule,
    MatCardModule,
  ],
  providers: [ProjectCommonChatApiService],
  animations: [
    trigger('messageAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProjectCommonChatComponent implements OnInit {

  messages = signal<any[]>([]);
  newMessage = signal('');
  textFormControl = new FormControl<string>('');

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;

  private projectCommonChatApiService = inject(ProjectCommonChatApiService);

  ngOnInit() {
    this.projectCommonChatApiService.getHistoryMessages(1)
      .pipe(tap(messages => this.messages.update(() => messages)))
      .subscribe();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessageToProjectManager(): void {
    const body = { task: this.textFormControl.value, target: 'product_manager' };

    this.projectCommonChatApiService.sendMessageToProjectManager(body).pipe(
      tap(res => {
        this.textFormControl.setValue(null);
        this.messages.update((oldMessages) => [...oldMessages, {
          author: 'Bot', text: res.response, timestamp: new Date(),
        }]);
      }),
    ).subscribe();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

}
