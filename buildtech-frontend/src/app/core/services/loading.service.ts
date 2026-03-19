import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private counter = new BehaviorSubject<number>(0);
  isLoading$ = this.counter.pipe(map(n => n > 0));

  show(): void { this.counter.next(this.counter.value + 1); }
  hide(): void { this.counter.next(Math.max(0, this.counter.value - 1)); }
}
