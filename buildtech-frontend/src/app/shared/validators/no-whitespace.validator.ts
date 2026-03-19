import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const isWhitespace = control.value.trim().length === 0;
  return isWhitespace ? { noWhitespace: true } : null;
}
