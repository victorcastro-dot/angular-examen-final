import { Component, computed, input, output, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { Taller } from '../../models';

interface Portada {
  icono: string;
  fondo: string;
}

const PORTADAS: Record<string, Portada> = {
  'Programación': { icono: 'bi-code-slash', fondo: 'linear-gradient(135deg, #0d9488, #0e7490)' },
  'Diseño': { icono: 'bi-palette', fondo: 'linear-gradient(135deg, #db2777, #f59e0b)' },
  'Idiomas': { icono: 'bi-translate', fondo: 'linear-gradient(135deg, #4f46e5, #06b6d4)' },
  'Habilidades blandas': { icono: 'bi-mic', fondo: 'linear-gradient(135deg, #ea580c, #e11d48)' },
};

const PORTADA_POR_DEFECTO: Portada = {
  icono: 'bi-mortarboard',
  fondo: 'linear-gradient(135deg, #475569, #1e293b)',
};

@Component({
  selector: 'app-taller-card',
  imports: [NgClass, CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './taller-card.html',
  styleUrl: './taller-card.scss',
})
export class TallerCard {
  taller = input.required<Taller>();
  inscribir = output<Taller>();

  portada = computed(() => PORTADAS[this.taller().categoria] ?? PORTADA_POR_DEFECTO);

  // Si la foto no existe, se muestra la carátula con icono
  imagen = computed(() => `img/talleres/${this.taller().id}.jpg`);
  imagenFallo = signal(false);

  porcentajeOcupado = computed(() => {
    const t = this.taller();
    return t.cupoTotal ? Math.round(((t.cupoTotal - t.cupoDisponible) / t.cupoTotal) * 100) : 0;
  });

  onInscribir() {
    this.inscribir.emit(this.taller());
  }
}
