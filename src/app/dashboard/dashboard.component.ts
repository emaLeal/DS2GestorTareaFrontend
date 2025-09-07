import { Component, OnInit, OnDestroy } from '@angular/core';
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
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
