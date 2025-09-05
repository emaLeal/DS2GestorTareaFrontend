import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-help',
  imports: [CommonModule, RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  openFaq: number | null = null;

  toggleFaq(index: number) {
    this.openFaq = this.openFaq === index ? null : index;
  }
}
