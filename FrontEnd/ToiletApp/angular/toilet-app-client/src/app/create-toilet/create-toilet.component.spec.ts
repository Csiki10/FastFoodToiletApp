import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateToiletComponent } from './create-toilet.component';

describe('CreateToiletComponent', () => {
  let component: CreateToiletComponent;
  let fixture: ComponentFixture<CreateToiletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateToiletComponent]
    });
    fixture = TestBed.createComponent(CreateToiletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
