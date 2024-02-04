import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateToiletComponent } from './update-toilet.component';

describe('UpdateToiletComponent', () => {
  let component: UpdateToiletComponent;
  let fixture: ComponentFixture<UpdateToiletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateToiletComponent]
    });
    fixture = TestBed.createComponent(UpdateToiletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
