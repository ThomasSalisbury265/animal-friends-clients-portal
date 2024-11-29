import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, of, take, tap } from 'rxjs';
import { ClientResponse, Client } from '../../../shared/models/api/client-response.interface';
import { ApiService } from '../../../core/services/api.service';
import { ClientDashboard } from '../../../shared/models/ui/client-dashboard.interface';
import { ClientDetails } from '../../../shared/models/ui/client-details.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiService: ApiService = inject(ApiService);
  private dashboardClients = new BehaviorSubject<Array<ClientDashboard>>([]);
  private seedId: string | undefined = undefined;
  private clientsMap = new Map<string, Client>();
  private loadedPages = new Set<number>();
  private currentPage: number = 1;
  private resultsPerPage: number = 20;

  public dashboardClients$: Observable<Array<ClientDashboard>> = this.dashboardClients.asObservable();

  constructor() { }

  public initialiseClients(): Observable<boolean> {
    if (this.dashboardClients.value.length > 0) {
      return of(true);
    }

    return this.getClients(this.resultsPerPage, this.currentPage).pipe(
      map(() => true)
    )
  }

  public getClients(results: number = 20, page: number = 1): Observable<void> {
    if (this.loadedPages.has(page)) return of();

    let params = `results=${results}&page=${page}`;
    if (this.seedId) {
      params += `&seed=${this.seedId}`;
    }

    return this.apiService.get<ClientResponse>(params).pipe(
      take(1),
      tap(response => {
        if (!this.seedId) this.seedId = response.info.seed
      }),
      tap(response => response.results.map((client) => this.clientsMap.set(client.login.uuid, client))),
      map(response => response.results.map((client) => this.transformToDashboardModel(client))),
      tap(dashboardClients => {
        const currentClients = this.dashboardClients.value;
        this.dashboardClients.next([...currentClients, ...dashboardClients])
      }),
      tap(() => this.loadedPages.add(page)),
      map(() => {})
    );
  }

  public getClientDetails(id: string): Observable<ClientDetails | undefined> {
    const client = this.clientsMap.get(id);

    if (client) {
      const clientDetails = this.transformToDetails(client);
      return of(clientDetails);
    } else {
      return of(undefined);
    }
  }

  public loadMoreClients(): void {
    this.currentPage++;
    this.getClients(this.resultsPerPage, this.currentPage).subscribe();
  }

  private transformToDashboardModel(client: Client): ClientDashboard {
    return {
      id: client.login.uuid,
      name: {
        title: client.name.title,
        first: client.name.first,
        last: client.name.last
      },
      email: client.email,
      username: client.login.username,
      country: client.location.country,
      picture: client.picture.thumbnail,
    };
  }

  private transformToDetails(client: Client): ClientDetails {
    return {
      id: client.login.uuid,
      name: {
        title: client.name.title,
        first: client.name.first,
        last: client.name.last
      },
      email: client.email,
      username: client.login.username,
      country: client.location.country,
      city: client.location.city,
      state: client.location.state,
      dateOfBirth: new Date(client.dob.date).toLocaleDateString(),
      registered: new Date(client.registered.date).toLocaleDateString(),
      phone: client.phone,
      picture: client.picture.large,
    };
  }
}
