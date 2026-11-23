import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from '../../services/db.service';
import { Taller } from '../../models';
import { TallerCard } from '../../components/taller-card/taller-card';
import { Paginador } from '../../components/paginador/paginador';

@Component({
  selector: 'app-talleres',
  imports: [TallerCard, Paginador],
  templateUrl: './talleres.html',
})
export class Talleres implements OnInit {
  private db = inject(DbService);
  private router = inject(Router);

  readonly porPagina = 3;

  talleres = signal<Taller[]>([]);
  busqueda = signal('');
  categoria = signal('');
  pagina = signal(1);
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

  paginados = computed(() => {
    const inicio = (this.pagina() - 1) * this.porPagina;
    return this.filtrados().slice(inicio, inicio + this.porPagina);
  });

  async ngOnInit() {
    this.talleres.set(await this.db.getTalleres());
    this.cargando.set(false);
  }

  buscar(texto: string) {
    this.busqueda.set(texto);
    this.pagina.set(1);
  }

  filtrarPorCategoria(categoria: string) {
    this.categoria.set(categoria);
    this.pagina.set(1);
  }

  limpiar() {
    this.busqueda.set('');
    this.categoria.set('');
    this.pagina.set(1);
  }

  irAInscribir(taller: Taller) {
    this.router.navigate(['/inscribir'], { queryParams: { taller: taller.id } });
  }
}
