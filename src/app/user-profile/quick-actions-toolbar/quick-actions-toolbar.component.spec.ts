import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickActionsToolbarComponent } from './quick-actions-toolbar.component';

describe('QuickActionsToolbarComponent', () => {
  let component: QuickActionsToolbarComponent;
  let fixture: ComponentFixture<QuickActionsToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickActionsToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickActionsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
