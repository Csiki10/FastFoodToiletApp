import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOpinionComponent } from './create-opinion.component';

describe('CreateOpinionComponent', () => {
  let component: CreateOpinionComponent;
  let fixture: ComponentFixture<CreateOpinionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateOpinionComponent]
    });
    fixture = TestBed.createComponent(CreateOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
