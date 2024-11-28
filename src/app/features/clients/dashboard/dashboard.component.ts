import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientDashboard } from '../../../../shared/models/ui/client-dashboard.interface';
import { BehaviorSubject, Observable, combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { ClientsService } from '../clients.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClientCardComponent } from '../../../../shared/components/client-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ClientCardComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private clientsService: ClientsService = inject(ClientsService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private itemsPerPage: number = 8;

  public currentPage$ = new BehaviorSubject<number>(1);
  public clients$: Observable<Array<ClientDashboard>> | undefined;
  public filteredClients$!: Observable<Array<ClientDashboard>>;
  public searchControl = new FormControl('');
  public totalPages = 1;
  public pagesArray: number[] = [];

  ngOnInit(): void {
    this.clients$ = this.clientsService.dashboardClients$;

    this.filteredClients$ = combineLatest([
      this.clients$,
      this.searchControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        startWith('')
      ),
      this.currentPage$
    ]).pipe(
      map(([clients, searchTerm, currentPage]) => {
        const filtered = this.filterClients(clients, searchTerm);

        // Calculate total pages
        this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
        this.pagesArray = Array(this.totalPages).fill(0).map((x, i) => i + 1);

        // Ensure current page is within range
        if (currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage$.next(this.totalPages);
          currentPage = this.totalPages;
        }

        // Get clients for the current page
        const startIndex = (currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        return filtered.slice(startIndex, endIndex);
      })
    )
  }

  public onClickClient(id: string) {
    this.router.navigate([id], { relativeTo: this.route})
  }

  public loadMoreClients() {
    this.clientsService.loadMoreClients();
  }

  public onPageChange(page: number): void {
    this.currentPage$.next(page);
  }

  public prevPage(): void {
    const currentPage = this.currentPage$.value;
    if (currentPage > 1) {
      this.onPageChange(currentPage - 1);
    }
  }

  public nextPage(): void {
    const currentPage = this.currentPage$.value;
    if (currentPage < this.totalPages) {
      this.onPageChange(currentPage + 1);
    }
  }

  private filterClients(clients: ClientDashboard[], searchTerm: string | null): ClientDashboard[] {
    if (!searchTerm) {
      return clients;
    }
    const lowerCaseTerm = searchTerm.toLowerCase();
    return clients.filter(client =>
      client.name.first.toLowerCase().includes(lowerCaseTerm) ||
      client.name.last.toLowerCase().includes(lowerCaseTerm) ||
      client.email?.toLowerCase().includes(lowerCaseTerm)
    );
  }
}
