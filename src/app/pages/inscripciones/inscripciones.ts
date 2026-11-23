import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { DbService } from '../../services/db.service';
import { EstadoInscripcion, Inscripcion } from '../../models';
import { Paginador } from '../../components/paginador/paginador';

@Component({
  selector: 'app-inscripciones',
  imports: [DatePipe, NgClass, TitleCasePipe, Paginador],
  templateUrl: './inscripciones.html',
})
export class Inscripciones implements OnInit {
  private db = inject(DbService);
  private router = inject(Router);

  readonly porPagina = 5;

  inscripciones = signal<Inscripcion[]>([]);
  estado = signal<'' | EstadoInscripcion>('');
  pagina = signal(1);
  cargando = signal(true);

  filtradas = computed(() =>
    this.inscripciones().filter((i) => !this.estado() || i.estado === this.estado()),
  );

  paginadas = computed(() => {
    const inicio = (this.pagina() - 1) * this.porPagina;
    return this.filtradas().slice(inicio, inicio + this.porPagina);
  });

  async ngOnInit() {
    this.inscripciones.set(await this.db.getInscripciones());
    this.cargando.set(false);
  }

  filtrarPorEstado(estado: '' | EstadoInscripcion) {
    this.estado.set(estado);
    this.pagina.set(1);
  }

  verDetalle(i: Inscripcion) {
    this.router.navigate(['/inscripciones', i.id]);
  }
}
