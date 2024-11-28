import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientDashboard } from '../../../../shared/models/ui/client-dashboard.interface';
import { Observable } from 'rxjs';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private clientsService: ClientsService = inject(ClientsService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private loadMore: number = 25;
  private loadMoreBy: number = 5;
  public clients$: Observable<Array<ClientDashboard>> | undefined;

  ngOnInit(): void {
    this.clients$ = this.clientsService.dashboardClients$
  }

  public onClickClient(id: string) {
    this.router.navigate([id], { relativeTo: this.route})
  }

  public loadMoreClients() {
    this.clientsService.getClients(this.loadMore);
    this.loadMore += this.loadMoreBy;
  }
}
