import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppDigestComponent } from './digest';
import { AppSnapshotComponent } from './snapshot';
import { AppDownloadComponent } from './download';
import { AppMachineComponent } from './machine';

const routes: Routes = [{
    path: 'machine',
    component: AppMachineComponent,
    pathMatch: 'full',
}, {
    path: 'digest',
    component: AppDigestComponent,
    pathMatch: 'full',
}, {
    path: 'snapshot/:name',
    component: AppSnapshotComponent,
    pathMatch: 'full',
}, {
    path: 'download',
    component: AppDownloadComponent,
    pathMatch: 'full',
}, {
    path: '**',
    redirectTo: 'digest',
    pathMatch: 'full',
}];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
