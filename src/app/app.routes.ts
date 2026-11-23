import { Routes } from '@angular/router';
import { Talleres } from './pages/talleres/talleres';
import { Inscribir } from './pages/inscribir/inscribir';

export const routes: Routes = [
  { path: '', redirectTo: 'talleres', pathMatch: 'full' },
  { path: 'talleres', component: Talleres, title: 'Talleres' },
  { path: 'inscribir', component: Inscribir, title: 'Nueva inscripción' },
  { path: '**', redirectTo: 'talleres' },
];
