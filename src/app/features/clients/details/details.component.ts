import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientsService } from '../clients.service';
import { Observable, of, switchMap } from 'rxjs';
import { ClientDetails } from '../../../../shared/models/ui/client-details.interface';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private clientsService: ClientsService = inject(ClientsService);
  public client$!: Observable<ClientDetails | undefined>;

  ngOnInit(): void {
    this.client$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (id) {
          return this.clientsService.getClientDetails(id);
        }
        return of(undefined);
      })
    );
  }

  public navigateBack() {
    this.router.navigateByUrl('');
  }
}
