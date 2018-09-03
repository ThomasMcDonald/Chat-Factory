import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToChannelComponent } from './add-to-group-channel.component';

describe('AddToGroupChannelComponent', () => {
  let component: AddToGroupChannelComponent;
  let fixture: ComponentFixture<AddToGroupChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToGroupChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToGroupChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
