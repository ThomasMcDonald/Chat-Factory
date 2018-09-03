import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUserGroupChannelComponent } from './remove-user-group-channel.component';

describe('RemoveUserGroupChannelComponent', () => {
  let component: RemoveUserGroupChannelComponent;
  let fixture: ComponentFixture<RemoveUserGroupChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveUserGroupChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveUserGroupChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
