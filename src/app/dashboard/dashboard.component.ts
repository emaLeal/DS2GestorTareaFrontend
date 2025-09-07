import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @Output() searchChanged = new EventEmitter<string>();
  isMenuOpen = false;
  searchTerm: string = '';
  sidebarCollapsed = false;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    // Detectar tamaño inicial de la pantalla
    this.updateSidebar(window.innerWidth);
  }

  ngOnDestroy(): void {}

  // 🎯 Detectar cambios de tamaño en la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateSidebar(event.target.innerWidth);
  }

  // 📌 Ajustar sidebar automáticamente según ancho
  private updateSidebar(width: number): void {
    if (width < 768) {
      this.sidebarCollapsed = true; // en pantallas pequeñas se colapsa
    } else {
      this.sidebarCollapsed = false; // en pantallas grandes se expande
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // 📌 El usuario siempre puede controlar manualmente
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onSearch(event: any): void {
    const term = event.target.value.toLowerCase();
    this.searchService.setSearchTerm(term);
  }

  logout(): void {
    console.log('Cerrar sesión');
    // TODO: desconectar sesión desde backend
  }
}
