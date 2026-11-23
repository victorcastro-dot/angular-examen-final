import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from '../../services/db.service';
import { Taller } from '../../models';
import { TallerCard } from '../../components/taller-card/taller-card';

@Component({
  selector: 'app-talleres',
  imports: [TallerCard],
  templateUrl: './talleres.html',
})
export class Talleres implements OnInit {
  private db = inject(DbService);
  private router = inject(Router);

  talleres = signal<Taller[]>([]);
  busqueda = signal('');
  categoria = signal('');
  cargando = signal(true);

  categorias = computed(() => [...new Set(this.talleres().map((t) => t.categoria))].sort());

  hayFiltros = computed(() => this.busqueda().trim() !== '' || this.categoria() !== '');

  filtrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const cat = this.categoria();
    return this.talleres().filter(
      (t) =>
        (!cat || t.categoria === cat) &&
        (!texto ||
          t.nombre.toLowerCase().includes(texto) ||
          t.instructor.toLowerCase().includes(texto)),
    );
  });

  async ngOnInit() {
    this.talleres.set(await this.db.getTalleres());
    this.cargando.set(false);
  }

  limpiar() {
    this.busqueda.set('');
    this.categoria.set('');
  }

  irAInscribir(taller: Taller) {
    this.router.navigate(['/inscribir'], { queryParams: { taller: taller.id } });
  }
}
