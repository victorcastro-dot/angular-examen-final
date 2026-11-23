import { Routes } from '@angular/router';
import { Talleres } from './pages/talleres/talleres';

export const routes: Routes = [
  { path: '', redirectTo: 'talleres', pathMatch: 'full' },
  { path: 'talleres', component: Talleres, title: 'Talleres' },
  { path: '**', redirectTo: 'talleres' },
];
