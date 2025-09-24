import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent as FullCalendar } from '@fullcalendar/angular';
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

  @ViewChild('fullCalendar') calendarInstance!: FullCalendar;

  eventoSelecionadoId: string | number | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [
      dayGridPlugin,
      timeGridWeekPlugin,
      interactionPlugin],
    initialView: 'timeGridWeek',

    locale: ptBrLocale,
    selectable: true,
    events: [],

    nowIndicator: true,
    expandRows: true, // expande as linhas para ocupar todo o espaço

    weekends: false, // não mostra sábado e domingo

    // Configurações de horário
    slotMinTime: '08:00:00',
    slotMaxTime: '17:00:00',
    slotDuration: '01:00:00',
    slotLabelInterval: '01:00', // rótulo a cada hora
    allDaySlot: false, // não mostra a coluna de todos os dias

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
    // eventClick: (arg) => this.eventClicked.emit(arg.event)

    eventClick: (arg) => {


      // Salva o evento clicado
      this.eventoSelecionadoId = arg.event.id;
      console.log('Evento clicado ', arg.event);

      // Atualiza a aparência do evento selecionado
      const calendarApi = arg.view.calendar;

      // Recarrega os eventos para aplicar o estilo
      calendarApi.getEvents().forEach(evt => {
        // Aplica estilo ao evento selecionado
        if (evt.id === this.eventoSelecionadoId) {
          evt.setProp('backgroundColor', '#007bff');
          evt.setProp('borderColor', '#0056b3');
          evt.setProp('textColor', '#ffffff');
        }
        // Restaura o estilo dos eventos disponíveis não selecionados
        else if (evt.title === 'Disponível') {
          evt.setProp('backgroundColor', '#28a745');
          evt.setProp('borderColor', '#28a745');
          evt.setProp('textColor', '#ffffff');
        }
      });

      // Emite o evento para o componente pai
      this.eventClicked.emit(arg.event);
    }


  };

  ngOnChanges() {
    if (this.events) {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events // atualiza quando `events` mudar
      };
    }
  }

  public clearEvents() {
    if (this.calendarInstance) {
      console.log("Calendar Instance !!!")
      const api = this.calendarInstance.getApi();

      api.removeAllEvents();
      api.destroy();

      console.log("Remove todos os events");
      console.log("Destroi e recria novamente");

      setTimeout(() => {
        api.render();
        api.updateSize(); // 👈 força recalcular altura/largura
        window.dispatchEvent(new Event('resize')); // 👈 extra fallback
        console.log('Calendário limpo, recarregado e redimensionado.');
      }, 100);

    }
  }

}
