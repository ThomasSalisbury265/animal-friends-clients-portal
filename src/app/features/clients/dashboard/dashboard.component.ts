import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientsService } from '../clients.service';
import { ClientCardComponent } from '../../../../shared/components/client-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ClientCardComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private clientsService: ClientsService = inject(ClientsService);
  private dashboardService: DashboardService = inject(DashboardService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  public currentPage$ = this.dashboardService.currentPage$;
  public clients$ = this.dashboardService.clients$;
  public filteredClients$ = this.dashboardService.filteredClients$;
  public searchControl = this.dashboardService.searchControl;
  public totalPages$ = this.dashboardService.totalPages$;
  public pagesArray$ = this.dashboardService.pagesArray$;

  public onClickClient(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  public loadMoreClients() {
    this.clientsService.loadMoreClients();
  }

  public onPageChange(page: number): void {
    this.dashboardService.onPageChange(page);
  }

  public prevPage(): void {
    this.dashboardService.prevPage();
  }

  public nextPage(): void {
    this.dashboardService.nextPage();
  }
}
