import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponentTest } from './home-component-test.component';

describe('HomeComponent', () => {
  let component: HomeComponentTest;
  let fixture: ComponentFixture<HomeComponentTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponentTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponentTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
