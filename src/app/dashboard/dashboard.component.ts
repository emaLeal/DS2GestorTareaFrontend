import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
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


  constructor(
    private _searchService: SearchService,
    private _router: Router
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

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
    this._searchService.setSearchTerm(term);

  }

  logout(): void {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    this._router.navigate(['/login'])
  }
}
