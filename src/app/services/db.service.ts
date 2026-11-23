import { Injectable } from '@angular/core';
import { Inscripcion, Taller } from '../models';

const DB_NAME = 'talleresDB';
const DB_VERSION = 1;

const TALLERES_INICIALES: Taller[] = [
  { id: 1, nombre: 'Angular desde cero', categoria: 'Programación', instructor: 'ana rojas', precio: 350, cupoTotal: 20, cupoDisponible: 20, fechaInicio: '2026-12-07' },
  { id: 2, nombre: 'Python para análisis de datos', categoria: 'Programación', instructor: 'luis pérez', precio: 400, cupoTotal: 15, cupoDisponible: 15, fechaInicio: '2026-12-10' },
  { id: 3, nombre: 'Diseño UX/UI con Figma', categoria: 'Diseño', instructor: 'carla mendoza', precio: 300, cupoTotal: 12, cupoDisponible: 12, fechaInicio: '2026-12-14' },
  { id: 4, nombre: 'Fotografía con celular', categoria: 'Diseño', instructor: 'jorge salinas', precio: 150, cupoTotal: 3, cupoDisponible: 3, fechaInicio: '2026-12-05' },
  { id: 5, nombre: 'Inglés conversacional', categoria: 'Idiomas', instructor: 'mary johnson', precio: 280, cupoTotal: 10, cupoDisponible: 10, fechaInicio: '2026-12-08' },
  { id: 6, nombre: 'Portugués básico', categoria: 'Idiomas', instructor: 'paulo silva', precio: 250, cupoTotal: 8, cupoDisponible: 8, fechaInicio: '2027-01-12' },
  { id: 7, nombre: 'Oratoria y presentaciones', categoria: 'Habilidades blandas', instructor: 'sofía vargas', precio: 200, cupoTotal: 25, cupoDisponible: 25, fechaInicio: '2026-12-12' },
];

function req<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

@Injectable({ providedIn: 'root' })
export class DbService {
  private dbPromise: Promise<IDBDatabase> = this.abrir();

  private abrir(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      // Solo se ejecuta al crear la base: los datos iniciales se cargan una sola vez
      request.onupgradeneeded = () => {
        const db = request.result;
        const talleres = db.createObjectStore('talleres', { keyPath: 'id' });
        db.createObjectStore('inscripciones', { keyPath: 'id', autoIncrement: true });
        TALLERES_INICIALES.forEach((t) => talleres.add(t));
      };

      request.onsuccess = () => resolve(request.result);
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
}
