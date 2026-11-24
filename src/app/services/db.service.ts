import { Injectable } from '@angular/core';
import { Inscripcion, NuevaInscripcion, Taller } from '../models';

const DB_NAME = 'talleresDB';
const DB_VERSION = 2;

const TALLERES_INICIALES: Taller[] = [
  { id: 1, nombre: 'Angular desde cero', categoria: 'Programación', instructor: 'ana rojas', precio: 350, cupoTotal: 20, cupoDisponible: 20, fechaInicio: '2026-12-07' },
  { id: 2, nombre: 'Python para análisis de datos', categoria: 'Programación', instructor: 'luis pérez', precio: 400, cupoTotal: 15, cupoDisponible: 15, fechaInicio: '2026-12-10' },
  { id: 3, nombre: 'Diseño UX/UI con Figma', categoria: 'Diseño', instructor: 'carla mendoza', precio: 300, cupoTotal: 12, cupoDisponible: 12, fechaInicio: '2026-12-14' },
  { id: 4, nombre: 'Fotografía con celular', categoria: 'Diseño', instructor: 'jorge salinas', precio: 150, cupoTotal: 3, cupoDisponible: 3, fechaInicio: '2026-12-05' },
  { id: 5, nombre: 'Inglés conversacional', categoria: 'Idiomas', instructor: 'mary johnson', precio: 280, cupoTotal: 10, cupoDisponible: 10, fechaInicio: '2026-12-08' },
  { id: 6, nombre: 'Portugués básico', categoria: 'Idiomas', instructor: 'paulo silva', precio: 250, cupoTotal: 8, cupoDisponible: 8, fechaInicio: '2027-01-12' },
  { id: 7, nombre: 'Oratoria y presentaciones', categoria: 'Habilidades blandas', instructor: 'sofía vargas', precio: 200, cupoTotal: 25, cupoDisponible: 25, fechaInicio: '2026-12-12' },
];

const TALLERES_VERSION_2: Taller[] = [
  { id: 8, nombre: 'JavaScript moderno', categoria: 'Programación', instructor: 'diego flores', precio: 320, cupoTotal: 18, cupoDisponible: 18, fechaInicio: '2026-12-09' },
  { id: 9, nombre: 'Bases de datos con SQL', categoria: 'Programación', instructor: 'patricia quiroga', precio: 380, cupoTotal: 15, cupoDisponible: 15, fechaInicio: '2027-01-08' },
  { id: 10, nombre: 'Ilustración digital', categoria: 'Diseño', instructor: 'andrea camacho', precio: 270, cupoTotal: 2, cupoDisponible: 2, fechaInicio: '2026-12-16' },
  { id: 11, nombre: 'Francés básico', categoria: 'Idiomas', instructor: 'claire dubois', precio: 260, cupoTotal: 10, cupoDisponible: 10, fechaInicio: '2027-01-15' },
  { id: 12, nombre: 'Liderazgo y trabajo en equipo', categoria: 'Habilidades blandas', instructor: 'marcelo antezana', precio: 220, cupoTotal: 20, cupoDisponible: 20, fechaInicio: '2026-12-19' },
];

function req<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

@Injectable({ providedIn: 'root' })
export class DbService {
  private dbPromise: Promise<IDBDatabase> = this.abrir();

  private abrir(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      // Solo se ejecuta al crear la base o al subir DB_VERSION.
      // Cada versión agrega sus datos una sola vez y no borra las inscripciones existentes.
      request.onupgradeneeded = (event) => {
        const db = request.result;
        const tx = request.transaction!;

        if (event.oldVersion < 1) {
          db.createObjectStore('talleres', { keyPath: 'id' });
          db.createObjectStore('inscripciones', { keyPath: 'id', autoIncrement: true });
          TALLERES_INICIALES.forEach((t) => tx.objectStore('talleres').add(t));
        }

        if (event.oldVersion < 2) {
          TALLERES_VERSION_2.forEach((t) => tx.objectStore('talleres').add(t));
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        // Si otra pestaña abre una versión más nueva, se cierra esta conexión para no bloquearla
        db.onversionchange = () => db.close();
        resolve(db);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getTalleres(): Promise<Taller[]> {
    const db = await this.dbPromise;
    return req(db.transaction('talleres').objectStore('talleres').getAll());
  }

  async getTaller(id: number): Promise<Taller | undefined> {
    const db = await this.dbPromise;
    return req(db.transaction('talleres').objectStore('talleres').get(id));
  }

  async getInscripciones(): Promise<Inscripcion[]> {
    const db = await this.dbPromise;
    const lista = await req<Inscripcion[]>(
      db.transaction('inscripciones').objectStore('inscripciones').getAll(),
    );
    return lista.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  async getInscripcion(id: number): Promise<Inscripcion | undefined> {
    const db = await this.dbPromise;
    return req(db.transaction('inscripciones').objectStore('inscripciones').get(id));
  }

  // Reglas: el taller debe tener cupo y el mismo CI no puede inscribirse dos veces al mismo taller
  async inscribir(datos: NuevaInscripcion): Promise<number> {
    const db = await this.dbPromise;
    const tx = db.transaction(['talleres', 'inscripciones'], 'readwrite');
    const talleres = tx.objectStore('talleres');
    const inscripciones = tx.objectStore('inscripciones');

    const taller = await req<Taller | undefined>(talleres.get(datos.tallerId));
    if (!taller) {
      tx.abort();
      throw new Error('El taller seleccionado no existe.');
    }
    if (taller.cupoDisponible <= 0) {
      tx.abort();
      throw new Error(`El taller "${taller.nombre}" ya no tiene cupos disponibles.`);
    }

    const todas = await req<Inscripcion[]>(inscripciones.getAll());
    const repetida = todas.some(
      (i) => i.tallerId === datos.tallerId && i.ci === datos.ci && i.estado === 'Activa',
    );
    if (repetida) {
      tx.abort();
      throw new Error(`El estudiante con CI ${datos.ci} ya está inscrito en "${taller.nombre}".`);
    }

    taller.cupoDisponible--;
    talleres.put(taller);

    const nueva: Inscripcion = {
      ...datos,
      tallerNombre: taller.nombre,
      fecha: new Date().toISOString(),
      estado: 'Activa',
    };
    const id = await req(inscripciones.add(nueva));
    await done(tx);
    return id as number;
  }

  // Solo se puede retirar una vez y devuelve el cupo al taller
  async retirar(id: number): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(['talleres', 'inscripciones'], 'readwrite');
    const talleres = tx.objectStore('talleres');
    const inscripciones = tx.objectStore('inscripciones');

    const insc = await req<Inscripcion | undefined>(inscripciones.get(id));
    if (!insc) {
      tx.abort();
      throw new Error('La inscripción no existe.');
    }
    if (insc.estado !== 'Activa') {
      tx.abort();
      throw new Error('Esta inscripción ya fue retirada.');
    }

    insc.estado = 'Retirada';
    insc.fechaRetiro = new Date().toISOString();
    inscripciones.put(insc);

    const taller = await req<Taller | undefined>(talleres.get(insc.tallerId));
    if (taller) {
      taller.cupoDisponible = Math.min(taller.cupoDisponible + 1, taller.cupoTotal);
      talleres.put(taller);
    }
    await done(tx);
  }
}
