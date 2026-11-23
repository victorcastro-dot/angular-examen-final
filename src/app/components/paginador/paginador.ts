import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.html',
})
export class Paginador {
  total = input.required<number>();
  porPagina = input(5);
  pagina = input(1);
  cambiarPagina = output<number>();

  totalPaginas = computed(() => Math.max(1, Math.ceil(this.total() / this.porPagina())));
  paginas = computed(() => Array.from({ length: this.totalPaginas() }, (_, i) => i + 1));
  desde = computed(() => (this.total() === 0 ? 0 : (this.pagina() - 1) * this.porPagina() + 1));
  hasta = computed(() => Math.min(this.pagina() * this.porPagina(), this.total()));

  ir(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas() && pagina !== this.pagina()) {
      this.cambiarPagina.emit(pagina);
    }
  }
}
