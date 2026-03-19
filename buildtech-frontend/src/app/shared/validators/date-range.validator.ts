import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(startField: string, endField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startField)?.value;
    const end = group.get(endField)?.value;
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) {
      return { dateRange: { message: 'La fecha de fin debe ser posterior a la fecha de inicio' } };
    }
    return null;
  };
}
