import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStandComponent } from './edit-stand.component';

describe('EditStandComponent', () => {
  let component: EditStandComponent;
  let fixture: ComponentFixture<EditStandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
