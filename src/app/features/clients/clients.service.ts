import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiService: ApiService = inject(ApiService);

  constructor() { }
}
