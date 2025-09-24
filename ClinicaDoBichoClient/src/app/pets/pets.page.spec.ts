import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetsPage } from './pets.page';

describe('PetsPage', () => {
  let component: PetsPage;
  let fixture: ComponentFixture<PetsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
