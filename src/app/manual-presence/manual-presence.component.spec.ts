import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPresenceComponent } from './manual-presence.component';

describe('ManualPresenceComponent', () => {
  let component: ManualPresenceComponent;
  let fixture: ComponentFixture<ManualPresenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualPresenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
