import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, retry, timer } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse) => {
        if (error.status === 0) return timer(1000);
        return throwError(() => error);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let message = 'Error desconocido';
      if (error.status === 0) {
        message = 'Error de conexión. Verifica que el servidor esté activo.';
      } else if (error.error?.message) {
        message = error.error.message;
      } else if (error.error?.title) {
        message = error.error.title;
      } else if (error.status === 400) {
        message = 'Datos inválidos. Revisa los campos del formulario.';
      } else if (error.status === 404) {
        message = 'Recurso no encontrado.';
      } else if (error.status === 409) {
        message = 'Conflicto: el registro ya existe o viola una restricción única.';
      } else if (error.status === 500) {
        message = 'Error interno del servidor.';
      }
      notificationService.error(message);
      return throwError(() => error);
    })
  );
};
