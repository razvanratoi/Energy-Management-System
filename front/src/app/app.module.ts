import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AccessDeniedPageComponent} from './access-denied-page/access-denied-page.component';

import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {LogInComponent} from './log-in/log-in.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {ClientTableComponent} from './client-table/client-table.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {UserDialogComponent} from './dialogs/user-dialog/user-dialog.component';
import {DeviceDialogComponent} from './dialogs/device-dialog/device-dialog.component';
import {MappingDialogComponent} from './dialogs/mapping-dialog/mapping-dialog.component';
import {ConfirmDialogComponent} from './dialogs/confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {DeviceTableComponent} from './device-table/device-table.component';
import {MappingTableComponent} from './mapping-table/mapping-table.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ChartPageComponent} from './chart-page/chart-page.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {ChartComponent} from './chart/chart.component';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {WarningDialogComponent} from './dialogs/warning-dialog/warning-dialog.component';
import {AdminChatComponent} from './admin-chat/admin-chat.component';
import {ClientChatComponent} from './client-chat/client-chat.component';
import {ChatComponent} from './chat/chat.component';
import {MatListModule} from "@angular/material/list";

const config: SocketIoConfig = {url: 'http://localhost:3000', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    AccessDeniedPageComponent,
    LogInComponent,
    ClientTableComponent,
    UserDialogComponent,
    DeviceDialogComponent,
    MappingDialogComponent,
    ConfirmDialogComponent,
    DeviceTableComponent,
    MappingTableComponent,
    DashboardComponent,
    ChartPageComponent,
    ChartComponent,
    WarningDialogComponent,
    AdminChatComponent,
    ClientChatComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    MatToolbarModule,
    MatTableModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
