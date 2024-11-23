import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkpointComponent } from './workpoint.component';

describe('WorkpointComponent', () => {
  let component: WorkpointComponent;
  let fixture: ComponentFixture<WorkpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkpointComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
