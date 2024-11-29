import { inject } from '@angular/core';
import { ClientsService } from './clients.service';
import { catchError, map, of, take } from 'rxjs';

//mock resolver for demo purposes to get client data before leading clients feature but will always resolve
export const clientsResolver = () => {
  const clientsService: ClientsService = inject(ClientsService)

  clientsService.initialiseClients().pipe(
    take(1),
    map(() => true),
    catchError(() => of(true))
    ).subscribe();
  return true;
}
