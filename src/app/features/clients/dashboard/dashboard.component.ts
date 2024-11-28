import { Component, OnInit, inject } from '@angular/core';
import { ClientsService } from '../clients.service';
import { ClientDashboard } from '../../../../shared/models/ui/client-dashboard.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private clientsService: ClientsService = inject(ClientsService);
  public clients: ClientDashboard[] = [];
  ngOnInit(): void {
    this.clientsService.getClients();
    this.clientsService.dashboardClients$.subscribe((clients) => this.clients.push(...clients))
  }
}
