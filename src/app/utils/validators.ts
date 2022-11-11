import { _isNumberValue } from '@angular/cdk/coercion';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { CategoriesService } from '../core/services/categories.service';

import { map }from 'rxjs/operators';

export class MyValidators {

  static isPriceValid(control: AbstractControl) {
    const value = control.value;
    console.log(value);
    if (value > 10000) {
      return {price_invalid: true};
    }
    return null;
  }

  static validPassword(control: AbstractControl){
    const value = control.value;
    if (!containsNumber(value)) {
      return {invalid_password: true};
    }
    return null;

  }

  static matchPasswords(control: AbstractControl){
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if (password !== confirmPassword) {
      return {match_password: true};
    }
    return null;

  }

  static validateCategory(service: CategoriesService){
    return (control: AbstractControl) => {
      const value = control.value;
      return service.checkCategory(value)
      .pipe(
        map((response: any) => {
          const isAvailable = response.isAvailable;
          if(isAvailable){
            return {not_available: true}
          }
          return null;
        })
      )
    }
  }

}



function containsNumber(value:string){
  return value.split('').find(v => _isNumberValue(v)) !== undefined;
}

function inNumber(value:string){
  return !isNaN(parseInt(value, 10));
}
