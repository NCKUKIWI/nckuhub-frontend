import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // {
    //     path: "home",
    //     loadChildren: () =>
    //         import('src/app/pages/home/home.module').then(m => m.HomeModule)
    // }, {
    //     path: "clm",
    //     loadChildren: () =>
    //         import('src/app/pages/clm/clm.module').then(m => m.ClmModule)
    // }, {
    //     path: "plm",
    //     loadChildren: () =>
    //         import('src/app/pages/plm/plm.module').then(m => m.PlmModule)
    // }, {
    //     path: "cmn",
    //     loadChildren: () =>
    //         import('src/app/pages/cmn/cmn.module').then(m => m.CmnModule)
    // }, {
    //     path: "itm",
    //     loadChildren: () =>
    //         import('src/app/pages/itm/itm.module').then(m => m.ItmModule)
    // }, {
    //     path: "mtm",
    //     loadChildren: () =>
    //         import('src/app/pages/mtm/mtm.module').then(m => m.MtmModule)
    // }, {
    //     path: "com",
    //     loadChildren: () =>
    //         import('src/app/pages/com/com.module').then(m => m.ComModule)
    // }, {
    //     path: "enm",
    //     loadChildren: () =>
    //         import('src/app/pages/enm/enm.module').then(m => m.EnmModule)
    // }, {
    //     path: "mlm",
    //     loadChildren: () =>
    //         import('src/app/pages/mlm/mlm.module').then(m => m.MlmModule)
    // }, {
    //     path: 'error',
    //     component: SCSBErrorComponent
    // }, {
    //     path: "sso",
    //     component: SsoComponent,
    // }, {
    //     path: "demo",
    //     loadChildren: () =>
    //         import('src/app/pages/demo/demo.module').then(m => m.DemoModule)
    // }, {
    //     path: "login", component: LoginComponent
    // }, {
    //     path: "",
    //     loadChildren: () =>
    //         import('src/app/pages/home/home.module').then(m => m.HomeModule)
    // }, {
    //     path: "**", 
    //     redirectTo: "", 
    //     pathMatch: "full"
    // }
    {
        path: "**",
        redirectTo: "",
        pathMatch: "full"
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
