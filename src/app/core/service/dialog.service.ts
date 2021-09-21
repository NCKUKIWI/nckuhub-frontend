import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, Type, EmbeddedViewRef, ComponentRef } from '@angular/core';
import { DynamicDialogComponent } from 'primeng/dynamicdialog';
import { DynamicDialogInjector } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable()
export class DialogService {

    // orgin // dialogComponentRef: ComponentRef<DynamicDialogComponent>;
    dialogComponentRefMap: Map<DynamicDialogRef, ComponentRef<DynamicDialogComponent>> = new Map();

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) { }

    public open(componentType: Type<any>, config: DynamicDialogConfig) {
        const dialogRef = this.appendDialogComponentToBody(config);

        // this.dialogComponentRef.instance.childComponentType = componentType;
        this.dialogComponentRefMap.get(dialogRef).instance.childComponentType = componentType;

        // fix tab focus issue when open dialog more than one
        // 2020.11.02
        // let preComponent ;
        this.dialogComponentRefMap.forEach((value, key) => {
            value.instance.unbindGlobalListeners() ; //.location.nativeElement.blur() ;
            // preComponent = value.instance ;
        });
        // preComponent.focus();
        return dialogRef;
    }

    public isShowing() {
        return this.dialogComponentRefMap.size > 0  ;
    }

    public closeAll() {
        this.dialogComponentRefMap.forEach((key, value) => {
            this.removeDialogComponentFromBody(value) ;
        }) ;
    }


    private appendDialogComponentToBody(config: DynamicDialogConfig) {
        const map = new WeakMap();
        map.set(DynamicDialogConfig, config);

        const dialogRef = new DynamicDialogRef();
        map.set(DynamicDialogRef, dialogRef);

        const sub = dialogRef.onClose.subscribe(() => {
            // orgin // this.dialogComponentRef.instance.close();
            this.dialogComponentRefMap.get(dialogRef).instance.close();
        });

        const destroySub = dialogRef.onDestroy.subscribe(() => {
            // orgin // this.removeDialogComponentFromBody();
            this.removeDialogComponentFromBody(dialogRef);
            destroySub.unsubscribe();
            sub.unsubscribe();
        });

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicDialogComponent);
        const componentRef = componentFactory.create(new DynamicDialogInjector(this.injector, map));

        this.appRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        this.dialogComponentRefMap.set(dialogRef, componentRef);

        return dialogRef;
    }

    // orgin // private removeDialogComponentFromBody() {
        // this.appRef.detachView(this.dialogComponentRef.hostView);
        // this.dialogComponentRef.destroy();
    // }
    private removeDialogComponentFromBody(dialogRef: DynamicDialogRef) {
        if(!dialogRef || !this.dialogComponentRefMap.has(dialogRef)) {
            return;
        }
        const dialogComponentRef = this.dialogComponentRefMap.get(dialogRef);
        this.appRef.detachView(dialogComponentRef.hostView);
        dialogComponentRef.destroy();
        this.dialogComponentRefMap.delete(dialogRef)
    }
}
