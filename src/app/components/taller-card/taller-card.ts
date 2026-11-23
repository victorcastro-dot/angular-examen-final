import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { Taller } from '../../models';

@Component({
  selector: 'app-taller-card',
  imports: [NgClass, CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './taller-card.html',
})
export class TallerCard {
  taller = input.required<Taller>();
  inscribir = output<Taller>();

  onInscribir() {
    this.inscribir.emit(this.taller());
  }
}
