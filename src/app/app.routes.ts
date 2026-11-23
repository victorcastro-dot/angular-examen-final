import { Routes } from '@angular/router';
import { Talleres } from './pages/talleres/talleres';
import { Inscribir } from './pages/inscribir/inscribir';
import { Inscripciones } from './pages/inscripciones/inscripciones';
import { InscripcionDetalle } from './pages/inscripcion-detalle/inscripcion-detalle';

export const routes: Routes = [
  { path: '', redirectTo: 'talleres', pathMatch: 'full' },
  { path: 'talleres', component: Talleres, title: 'Talleres' },
  { path: 'inscribir', component: Inscribir, title: 'Nueva inscripción' },
  { path: 'inscripciones', component: Inscripciones, title: 'Mis inscripciones' },
  { path: 'inscripciones/:id', component: InscripcionDetalle, title: 'Detalle de inscripción' },
  { path: '**', redirectTo: 'talleres' },
];
