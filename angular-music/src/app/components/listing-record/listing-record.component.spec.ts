import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingRecordComponent } from './listing-record.component';

describe('ListingRecordComponent', () => {
  let component: ListingRecordComponent;
  let fixture: ComponentFixture<ListingRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
