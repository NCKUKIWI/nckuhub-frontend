import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/pages/pages-routing.module').then((m) => m.PagesRoutingModule),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
