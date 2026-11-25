import { Routes } from '@angular/router';
import { Talleres } from './pages/talleres/talleres';
import { Inscribir } from './pages/inscribir/inscribir';
import { Inscripciones } from './pages/inscripciones/inscripciones';
import { InscripcionDetalle } from './pages/inscripcion-detalle/inscripcion-detalle';

export const routes: Routes = [
  { path: '', redirectTo: 'talleres', pathMatch: 'full' },
  { path: 'talleres', component: Talleres, title: 'Talleres · Talleres UAB' },
  { path: 'inscribir', component: Inscribir, title: 'Nueva inscripción · Talleres UAB' },
  { path: 'inscripciones', component: Inscripciones, title: 'Mis inscripciones · Talleres UAB' },
  { path: 'inscripciones/:id', component: InscripcionDetalle, title: 'Detalle de inscripción · Talleres UAB' },
  { path: '**', redirectTo: 'talleres' },
];
