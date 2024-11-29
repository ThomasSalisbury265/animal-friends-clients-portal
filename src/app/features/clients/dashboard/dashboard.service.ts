import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { ClientDashboard } from '../../../../shared/models/ui/client-dashboard.interface';
import { ClientsService } from '../clients.service';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private clientsService: ClientsService;
  private itemsPerPage: number = 8;

  public currentPage$ = new BehaviorSubject<number>(1);
  public clients$: Observable<Array<ClientDashboard>>;
  public filteredClients$!: Observable<Array<ClientDashboard>>;
  public searchControl = new FormControl('');
  public totalPages$ = new BehaviorSubject<number>(1);
  public pagesArray$= new BehaviorSubject<Array<number>>([]);

  constructor(clientsService: ClientsService) {
    this.clientsService = clientsService;
    this.clients$ = this.clientsService.dashboardClients$;

    this.filteredClients$ = combineLatest([
      this.clients$,
      this.searchControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        startWith('')
      ),
      this.currentPage$,
    ]).pipe(
      map(([clients, searchTerm, currentPage]) => {
        const filtered = this.filterClients(clients, searchTerm);

        // Calculate total pages
        const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
        const pagesArray = Array(totalPages)
          .fill(0)
          .map((x, i) => i + 1);

        this.totalPages$.next(totalPages);
        this.pagesArray$.next(pagesArray);

        // Ensure current page is within range
        if (currentPage > totalPages && totalPages > 0) {
          this.currentPage$.next(totalPages);
          currentPage = totalPages;
        }

        // Get clients for the current page
        const startIndex = (currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        return filtered.slice(startIndex, endIndex);
      })
    );
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
    const totalPages =  this.totalPages$.value;
    if (currentPage < totalPages) {
      this.onPageChange(currentPage + 1);
    }
  }

  private filterClients(clients: ClientDashboard[], searchTerm: string | null): ClientDashboard[] {
    if (!searchTerm) {
      return clients;
    }
    const lowerCaseTerm = searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.first.toLowerCase().includes(lowerCaseTerm) ||
        client.name.last.toLowerCase().includes(lowerCaseTerm) ||
        client.email?.toLowerCase().includes(lowerCaseTerm)
    );
  }
}
