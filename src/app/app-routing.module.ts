import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppHostComponent } from './host';
import { AppHostDetailComponent } from './host/detail/detail.component';

const routes: Routes = [{
    path: '',
    redirectTo: 'host',
    pathMatch: 'full',
}, {
    path: 'host',
    component: AppHostComponent,
}, {
    path: 'host/:name',
    component: AppHostDetailComponent,
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
