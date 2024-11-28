import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly _baseUrl = environment.clientsEndpoint;
  private http = inject(HttpClient);

  constructor() { }

  public get<T>(): Observable<T> {
    return this.http.get<T>(`${this._baseUrl}?results=20&page=1`).pipe(
      catchError(this.handleHttpError)
    )
  }

  private handleHttpError(error: HttpErrorResponse) {
    console.log('API Error: ', error);
    return throwError(() => error.message);
  }
}
