import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskflowComponent } from './taskflow.component';

describe('TaskflowComponent', () => {
  let component: TaskflowComponent;
  let fixture: ComponentFixture<TaskflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskflowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
