import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Service()
export class Spinnerservice {
    private totalRequests = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() {
    this.totalRequests++;
    this.loadingSubject.next(true);
  }

  hide() {
    this.totalRequests--;
    if (this.totalRequests <= 0) {
      this.totalRequests = 0;
      this.loadingSubject.next(false);
    }
  }
  forceStop() {
    this.totalRequests = 0;
    this.loadingSubject.next(false);
  }
}
