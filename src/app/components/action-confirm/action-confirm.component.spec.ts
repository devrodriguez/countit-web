import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionConfirmComponent } from './action-confirm.component';

describe('ActionConfirmComponent', () => {
  let component: ActionConfirmComponent;
  let fixture: ComponentFixture<ActionConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
