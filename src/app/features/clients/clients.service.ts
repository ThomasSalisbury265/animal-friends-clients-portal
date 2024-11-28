import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Client, ClientResponse } from '../../../shared/models/api/client-response.interface';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ClientDashboard } from '../../../shared/models/ui/client-dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiService: ApiService = inject(ApiService);
  private dashboardClients = new BehaviorSubject<Array<ClientDashboard>>([]);

  public dashboardClients$: Observable<Array<ClientDashboard>> = this.dashboardClients.asObservable();

  constructor() {}

  public getClients() {
    this.apiService.get<ClientResponse>().pipe(
      map(response => response.results.map((client) => this.transformToDashboardModel(client))),
      tap(dashboardClients => {
        const currentClients = this.dashboardClients.value;
        this.dashboardClients.next([...currentClients, ...dashboardClients])
      })
    ).subscribe();
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
}
