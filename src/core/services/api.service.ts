import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly _baseUrl = environment.clientsEndpoint;
  private http = inject(HttpClient);

  constructor() { }

  public get<T>(queryParams?: string): Observable<T> {
    let url = queryParams ? `${this._baseUrl}?${queryParams}` : this._baseUrl;
    return this.http.get<T>(`${url}`).pipe(
      catchError(this.handleHttpError)
    );
  }

  private handleHttpError(error: HttpErrorResponse) {
    console.log('API Error: ', error);
    return throwError(() => error.message);
  }
}
