import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "nextLine",
})
export class NextLinePipe implements PipeTransform {
    transform(value: string, key: string): string {
        if (!value) {
            return value;
        } else {
            const rex = new RegExp("(?:" + key + ")", "g");
            return value.replace(rex, "<br>");
        }
    }
}
