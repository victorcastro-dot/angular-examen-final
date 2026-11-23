import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { DbService } from '../../services/db.service';
import { Inscripcion, Taller } from '../../models';

@Component({
  selector: 'app-inscribir',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './inscribir.html',
})
export class Inscribir implements OnInit {
  private db = inject(DbService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  talleres = signal<Taller[]>([]);
  private inscripciones: Inscripcion[] = [];
  errorGuardar = signal('');
  guardando = signal(false);

  form = this.fb.nonNullable.group(
    {
      estudiante: ['', [Validators.required, Validators.minLength(3)]],
      ci: ['', [Validators.required, Validators.pattern(/^\d{5,10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      tallerId: [0, [Validators.required, Validators.min(1)]],
    },
    { validators: (g) => this.reglasDelTema(g) },
  );

  async ngOnInit() {
    this.talleres.set(await this.db.getTalleres());
    this.inscripciones = await this.db.getInscripciones();

    const tallerId = Number(this.route.snapshot.queryParamMap.get('taller'));
    if (tallerId) this.form.controls.tallerId.setValue(tallerId);
    this.form.updateValueAndValidity();
  }

  // Reglas del tema: cupo disponible y sin inscripción repetida del mismo CI
  private reglasDelTema(g: AbstractControl): ValidationErrors | null {
    const { tallerId, ci } = g.value as { tallerId: number; ci: string };
    const taller = this.talleres?.().find((t) => t.id === Number(tallerId));
    if (taller && taller.cupoDisponible <= 0) return { sinCupo: true };
    const repetida = this.inscripciones?.some(
      (i) => i.tallerId === Number(tallerId) && i.ci === ci && i.estado === 'Activa',
    );
    return repetida ? { duplicada: true } : null;
  }

  tallerSeleccionado(): Taller | undefined {
    return this.talleres().find((t) => t.id === Number(this.form.controls.tallerId.value));
  }

  invalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  async guardar() {
    this.errorGuardar.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    try {
      const v = this.form.getRawValue();
      const id = await this.db.inscribir({
        tallerId: Number(v.tallerId),
        estudiante: v.estudiante.trim(),
        ci: v.ci.trim(),
        email: v.email.trim(),
      });
      this.router.navigate(['/inscripciones', id], { queryParams: { nueva: 1 } });
    } catch (e) {
      this.errorGuardar.set((e as Error).message);
    } finally {
      this.guardando.set(false);
    }
  }
}
