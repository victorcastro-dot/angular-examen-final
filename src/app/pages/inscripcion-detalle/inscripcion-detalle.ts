import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { DbService } from '../../services/db.service';
import { Inscripcion, Taller } from '../../models';

@Component({
  selector: 'app-inscripcion-detalle',
  imports: [RouterLink, DatePipe, CurrencyPipe, NgClass, TitleCasePipe],
  templateUrl: './inscripcion-detalle.html',
})
export class InscripcionDetalle implements OnInit {
  private db = inject(DbService);
  private route = inject(ActivatedRoute);

  inscripcion = signal<Inscripcion | undefined>(undefined);
  taller = signal<Taller | undefined>(undefined);
  cargando = signal(true);
  mensaje = signal('');
  error = signal('');

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.route.snapshot.queryParamMap.has('nueva')) {
      this.mensaje.set('¡Inscripción registrada correctamente!');
    }
    await this.cargar(id);
  }

  private async cargar(id: number) {
    const insc = Number.isInteger(id) ? await this.db.getInscripcion(id) : undefined;
    this.inscripcion.set(insc);
    this.taller.set(insc ? await this.db.getTaller(insc.tallerId) : undefined);
    this.cargando.set(false);
  }

  async retirar() {
    const insc = this.inscripcion();
    if (!insc?.id) return;
    if (!confirm(`¿Retirar la inscripción de ${insc.estudiante} en "${insc.tallerNombre}"?`)) return;

    this.error.set('');
    try {
      await this.db.retirar(insc.id);
      await this.cargar(insc.id);
      this.mensaje.set('Inscripción retirada. Se liberó 1 cupo en el taller.');
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
}
