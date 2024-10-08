import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './authentication/page404/page404.component';
import { AuthGuard } from './core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';

import { TestcomponentComponent } from './testcomponent/testcomponent.component';
import { LoGinComponent } from './lo-gin/lo-gin.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { SortingComponent } from './shared/components/sorting/sorting.component';
const routes: Routes = [
  // Redirect root path to login page
  { path: '', redirectTo: 'authentication/signin', pathMatch: 'full' },

  // Authentication routes
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
      {
        path: '**', 
        component: Page404Component // Handle any other routes within the authentication module
      }
    ],
  },
  
  // Main application routes (protected)
  {
    path: 'pagination',
    component: PaginationComponent
  },
  {
    path: 'sorting',
    component: SortingComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'agent',
        loadChildren: () =>
          import('./agent/agent.module').then((m) => m.AgentModule),
      },
      {
        path: 'consultancy',
        loadChildren: () =>
          import('./consultancy/consultancy.module').then((m) => m.ConsultancyModule),
      },
      {
        path: 'student',
        loadChildren: () =>
          import('./student/student.module').then((m) => m.StudentModule),
      },
 
     
    //   {
    //     path: 'advance-table',
    //     loadChildren: () =>
    //       import('./advance-table/advance-table.module').then(
    //         (m) => m.AdvanceTableModule
    //       ),
    //   },
    //   {
    //     path: 'calendar',
    //     loadChildren: () =>
    //       import('./calendar/calendar.module').then((m) => m.CalendarsModule),
    //   },
    //   {
    //     path: 'task',
    //     loadChildren: () =>
    //       import('./task/task.module').then((m) => m.TaskModule),
    //   },
    
    //   {
    //     path: 'contacts',
    //     loadChildren: () =>
    //       import('./contacts/contacts.module').then((m) => m.ContactsModule),
    //   },
    //   {
    //     path: 'email',
    //     loadChildren: () =>
    //       import('./email/email.module').then((m) => m.EmailModule),
    //   },
    //   {
    //     path: 'apps',
    //     loadChildren: () =>
    //       import('./apps/apps.module').then((m) => m.AppsModule),
    //   },
    //   {
    //     path: 'widget',
    //     loadChildren: () =>
    //       import('./widget/widget.module').then((m) => m.WidgetModule),
    //   },
    //   {
    //     path: 'ui',
    //     loadChildren: () => import('./ui/ui.module').then((m) => m.UiModule),
    //   },
    //   {
    //     path: 'forms',
    //     loadChildren: () =>
    //       import('./forms/forms.module').then((m) => m.FormModule),
    //   },
    //   {
    //     path: 'tables',
    //     loadChildren: () =>
    //       import('./tables/tables.module').then((m) => m.TablesModule),
    //   },
    //   {
    //     path: 'charts',
    //     loadChildren: () =>
    //       import('./charts/charts.module').then((m) => m.ChartsModule),
    //   },
    //   {
    //     path: 'timeline',
    //     loadChildren: () =>
    //       import('./timeline/timeline.module').then((m) => m.TimelineModule),
    //   },
    //   {
    //     path: 'icons',
    //     loadChildren: () =>
    //       import('./icons/icons.module').then((m) => m.IconsModule),
    //   },
    //   {
    //     path: 'extra-pages',
    //     loadChildren: () =>
    //       import('./extra-pages/extra-pages.module').then(
    //         (m) => m.ExtraPagesModule
    //       ),
    //   },
    //   {
    //     path: 'maps',
    //     loadChildren: () =>
    //       import('./maps/maps.module').then((m) => m.MapsModule),
    //   },
    //   {
    //     path: 'multilevel',
    //     loadChildren: () =>
    //       import('./multilevel/multilevel.module').then(
    //         (m) => m.MultilevelModule
    //       ),
    //   },

    ],
  },

  // Wildcard route for 404
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
