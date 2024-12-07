import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPackagingComponent } from './edit-packaging.component';

describe('EditPackagingComponent', () => {
  let component: EditPackagingComponent;
  let fixture: ComponentFixture<EditPackagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPackagingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPackagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
