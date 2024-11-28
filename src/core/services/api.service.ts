import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly _baseUrl = environment.clientsEndpoint;
  private http = inject(HttpClient);

  constructor() { }
}
