import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkpointComponent } from './edit-workpoint.component';

describe('EditWorkpointComponent', () => {
  let component: EditWorkpointComponent;
  let fixture: ComponentFixture<EditWorkpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWorkpointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWorkpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
