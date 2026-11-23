import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { DbService } from '../../services/db.service';
import { Taller } from '../../models';

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
  errorGuardar = signal('');
  guardando = signal(false);

  form = this.fb.nonNullable.group({
    estudiante: ['', [Validators.required, Validators.minLength(3)]],
    ci: ['', [Validators.required, Validators.pattern(/^\d{5,10}$/)]],
    email: ['', [Validators.required, Validators.email]],
    tallerId: [0, [Validators.required, Validators.min(1)]],
  });

  async ngOnInit() {
    this.talleres.set(await this.db.getTalleres());

    const tallerId = Number(this.route.snapshot.queryParamMap.get('taller'));
    if (tallerId) this.form.controls.tallerId.setValue(tallerId);
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
