import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { DbService } from '../../services/db.service';
import { EstadoInscripcion, Inscripcion } from '../../models';

@Component({
  selector: 'app-inscripciones',
  imports: [DatePipe, NgClass, TitleCasePipe],
  templateUrl: './inscripciones.html',
})
export class Inscripciones implements OnInit {
  private db = inject(DbService);
  private router = inject(Router);

  inscripciones = signal<Inscripcion[]>([]);
  estado = signal<'' | EstadoInscripcion>('');
  cargando = signal(true);

  filtradas = computed(() =>
    this.inscripciones().filter((i) => !this.estado() || i.estado === this.estado()),
  );

  async ngOnInit() {
    this.inscripciones.set(await this.db.getInscripciones());
    this.cargando.set(false);
  }

  verDetalle(i: Inscripcion) {
    this.router.navigate(['/inscripciones', i.id]);
  }
}
