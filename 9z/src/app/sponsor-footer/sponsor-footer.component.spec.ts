import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorFooterComponent } from './sponsor-footer.component';

describe('SponsorFooterComponent', () => {
  let component: SponsorFooterComponent;
  let fixture: ComponentFixture<SponsorFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsorFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
