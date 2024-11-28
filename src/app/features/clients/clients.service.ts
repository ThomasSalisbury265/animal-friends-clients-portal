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
  public dashboardClients$: Observable<Array<ClientDashboard>> = this.dashboardClients.asObservable();

  private clientsMap = new Map<string, Client>();

  constructor() { }

  public getClients(results: number = 20, page: number = 1): void {
    let params: string = this.seedId ? `results=${results}&page=${page}&seed=${this.seedId}`
      : `results=${results}&page=${page}`;

    this.apiService.get<ClientResponse>(params).pipe(
      take(1),
      tap(response => this.seedId = response.info.seed),
      tap(response => response.results.map((client) => this.clientsMap.set(client.login.uuid, client))),
      map(response => response.results.map((client) => this.transformToDashboardModel(client))),
      tap(dashboardClients => this.dashboardClients.next(dashboardClients))
    ).subscribe();
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
