import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridWeekPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input() events: any[] = [];
  @Output() dateClicked = new EventEmitter<string>();
  @Output() eventClicked = new EventEmitter<any>();

  calendarOptions: CalendarOptions = {
    plugins: [
      dayGridPlugin,
      timeGridWeekPlugin,
      interactionPlugin],
    initialView: 'timeGridWeek',

    locale: ptBrLocale,
    selectable: true,
    events: [],

    weekends: false, // não mostra sábado e domingo

    // Configurações de horário
    slotMinTime: '08:00:00',
    slotMaxTime: '17:00:00',
    slotDuration: '01:00:00',
    allDaySlot: false,

    // Horário de trabalho (excluindo almoço)
    businessHours: [
        { daysOfWeek: [1, 2, 3, 4, 5], startTime: '08:00', endTime: '12:00' },
        { daysOfWeek: [1, 2, 3, 4, 5], startTime: '13:00', endTime: '17:00' }
    ],

    // Bloquear datas passadas
    // validRange: {
    //     start: new Date().toISOString().split('T')[0] // Data atual em formato YYYY-MM-DD
    // },

    dateClick: (arg) => this.dateClicked.emit(arg.dateStr),
    eventClick: (arg) => this.eventClicked.emit(arg.event)
  };

  ngOnChanges() {
    if (this.events) {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events // atualiza quando `events` mudar
      };
    }
  }

}
