import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter"
})
export class FilterPipe implements PipeTransform {
  transform(value: any, arg: boolean): any {
    if (value) {
      if (arg) {
        return value.filter(order => order.completed === true);
      } else {
        return value.filter(order => order.completed === false);
      }
    }
  }
}
