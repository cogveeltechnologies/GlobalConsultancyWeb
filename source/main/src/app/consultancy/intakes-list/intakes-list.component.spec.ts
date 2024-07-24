import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakesListComponent } from './intakes-list.component';

describe('IntakesListComponent', () => {
  let component: IntakesListComponent;
  let fixture: ComponentFixture<IntakesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntakesListComponent]
    });
    fixture = TestBed.createComponent(IntakesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
