import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable()
export class RequestHeaderInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith(environment.clientsEndpoint)) {
      const modifiedReq = req.clone({
        setHeaders: {
          Author: 'Animal Friends',
        },
      });
      return next.handle(modifiedReq);
    } else {
      return next.handle(req);
    }
  }
}
