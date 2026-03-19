import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private add(type: ToastType, message: string): void {
    const id = Math.random().toString(36).substring(2);
    const toast: Toast = { id, type, message };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    setTimeout(() => this.remove(id), 4000);
  }

  remove(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }

  success(message: string): void { this.add('success', message); }
  error(message: string): void { this.add('error', message); }
  warning(message: string): void { this.add('warning', message); }
  info(message: string): void { this.add('info', message); }
}
