import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
      if(!value)return null;
      if(!args)return value;
      args = args.toLowerCase();

      return value.filter(function(data){
          var course_info = data["deptId"]+ "-" +data["courseIndex"]+ "-" +data["courseName"]+ " " + data["deptId"]+ "-" + data["teacher"]+ "-" + data["time"]
          if (JSON.stringify(course_info).toLowerCase().includes(args))
            return data
      });
  }
}
