import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendarConsultaPage } from './agendar-consulta.page';

describe('AgendarConsultaPage', () => {
  let component: AgendarConsultaPage;
  let fixture: ComponentFixture<AgendarConsultaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendarConsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
