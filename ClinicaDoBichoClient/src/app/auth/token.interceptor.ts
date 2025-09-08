import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next ) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se for rota de login ou refresh, ignora e segue em frente.
  if (req.url.includes('/login') ||
    req.url.includes('/auth/refresh')) {
    return next(req);
  }

  // Para todas as outras rotas, adiciona o token.
  return from(authService.getAccessToken()).pipe(
    switchMap(accessToken => {
      console.log("token", accessToken)
      // Se não houver token, não há o que fazer, apenas continue.
      if (!accessToken) {
        return next(req);
      }

      // Clona a requisição e adiciona o cabeçalho de autorização.
      const request = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });

      // Envia a requisição com o token.
      return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
          // Se o erro for 401 (Não Autorizado), o token pode ter expirado.
          if (error.status === 401) {
            console.log('[Interceptor] Erro 401! Token expirado. Tentando renovar...');

            return from(authService.refreshToken()).pipe(
              switchMap((res: any) => {
                console.log('[Interceptor] Token renovado com sucesso!', res);
                // Salva os novos tokens recebidos.
                // Precisamos retornar a Promise para garantir a ordem.
                return from(authService.setTokens(res.access, res.refresh)).pipe(
                  switchMap(() => {
                    // Clona a requisição *original* com o *novo* token de acesso.
                    const newRequest = req.clone({
                      setHeaders: { Authorization: `Bearer ${res.access}` }
                    });

                    console.log('[Interceptor] Reenviando requisição com o novo token...');
                    return next(newRequest); // Reenvia a requisição e o fluxo continua.
                  })
                );
              }),
              catchError(refreshError => {
                console.error('[Interceptor] Falha ao renovar o token. Fazendo logout.', refreshError);

                // Se a renovação falhar (ex: refresh token também expirou),
                // desloga o usuário e o envia para a página de login.
                authService.logout();
                router.navigate(['/login']);

                // Retorna o erro para que a chamada original saiba que falhou.
                return throwError(() => refreshError);
              })
            );
          }
          // Se não for 401, apenas repassa o erro.
          return throwError(() => error);
        })
      );
    })
  );
};
