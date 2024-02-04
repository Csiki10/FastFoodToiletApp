import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListToiletsComponent } from './list-toilets.component';

describe('ListToiletsComponent', () => {
  let component: ListToiletsComponent;
  let fixture: ComponentFixture<ListToiletsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListToiletsComponent]
    });
    fixture = TestBed.createComponent(ListToiletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
