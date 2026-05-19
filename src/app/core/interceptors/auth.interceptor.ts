import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private static readonly REFRESH_ATTEMPT_HEADER = 'X-Refresh-Attempt';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this.attachToken(request);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (this.shouldRefresh(request, error)) {
          return this.authService.refresh().pipe(
            switchMap(() => next.handle(this.markAsRetried(request))),
            catchError((refreshError: HttpErrorResponse) => {
              this.authService.clearSession();
              this.router.navigate(['/auth']);
              return throwError(() => refreshError);
            })
          );
        }

        if (error.status === 401) {
          this.authService.clearSession();
          this.router.navigate(['/auth']);
        }
        return throwError(() => error);
      })
    );
  }

  private attachToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.authService.getToken();

    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  private shouldRefresh(request: HttpRequest<unknown>, error: HttpErrorResponse): boolean {
    return error.status === 401
      && !request.url.includes('/auth/')
      && !request.headers.has(AuthInterceptor.REFRESH_ATTEMPT_HEADER);
  }

  private markAsRetried(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const headers = request.headers.set(AuthInterceptor.REFRESH_ATTEMPT_HEADER, 'true');

    return this.attachToken(request.clone({ headers }));
  }
}
