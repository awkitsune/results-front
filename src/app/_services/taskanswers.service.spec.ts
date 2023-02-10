import { TestBed } from '@angular/core/testing';

import { TaskanswersService } from './taskanswers.service';

describe('TaskanswersService', () => {
  let service: TaskanswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskanswersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
