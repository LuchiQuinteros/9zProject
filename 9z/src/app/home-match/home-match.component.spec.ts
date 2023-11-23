import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMatchComponent } from './home-match.component';

describe('HomeMatchComponent', () => {
  let component: HomeMatchComponent;
  let fixture: ComponentFixture<HomeMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
