import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LogInComponent} from "./log-in/log-in.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AccessDeniedPageComponent} from "./access-denied-page/access-denied-page.component";
import {ChartPageComponent} from "./chart-page/chart-page.component";
import {ChatComponent} from "./chat/chat.component";

const routes: Routes = [
  {path: '', component: LogInComponent},
  {path: 'denied', component: AccessDeniedPageComponent},
  {path: 'dashboard/:type', component: DashboardComponent},
  {path: 'chart', component: ChartPageComponent},
  {path: 'chat', component: ChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
