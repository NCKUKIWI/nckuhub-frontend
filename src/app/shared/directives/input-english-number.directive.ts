import { Directive, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { NgControl } from "@angular/forms";
import { Subscription } from "rxjs/internal/Subscription";

@Directive({
    selector: "[appEnglishNumbersOnly]",
})
export class EnglishNumberDirective implements OnInit, OnDestroy {
    constructor(private _el: ElementRef, private ngControl: NgControl) {}

    valueSubscription: Subscription;

    ngOnInit(): void {
        this.valueSubscription = this.ngControl.control.valueChanges.subscribe(
            (value) => {
                this.ngControl.control.setValue(this.transData(value), {
                    emitEvent: false,
                });
            }
        );

        this._el.nativeElement.addEventListener("input", () => {
            this._el.nativeElement.value = this.transData(
                this._el.nativeElement.value
            );
            this.ngControl.control.setValue(this._el.nativeElement.value, {
                emitEvent: false,
            });
        });
    }

    transData(oldValue: string): string {
        if (typeof oldValue === "string") {
            return oldValue.replace(/[^a-zA-Z0-9]*/g, "");
        } else {
            return oldValue;
        }
    }

    ngOnDestroy(): void {
        this.valueSubscription.unsubscribe();
    }
}
