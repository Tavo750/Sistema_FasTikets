import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { baseUrl } from '../../../../../global';
import { SessionService } from '../../../../../shared/services/session.service';
import { HttpUtilsService } from '../../../../../shared/services/http-utils.service';
import { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  RegisterPaymentRequest, 
  RegisterPaymentResponse,
  CheckoutCarritoRequest 
} from '../interfaces/compra.interface';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private httpUtils: HttpUtilsService
  ) { }

  /**
   * Obtiene los headers con autorización
   */
  private getHeaders(): HttpHeaders {
    console.log('🔑 CompraService: Construyendo headers...');
    
    const currentUser = this.sessionService.getCurrentUser();
    console.log('👤 CompraService: Current user:', currentUser);
    
    const token = currentUser?.token;
    console.log('🎫 CompraService: Token:', token ? 'EXISTE ✅' : 'NO EXISTE ❌');
    
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('🔐 CompraService: Authorization header agregado');
    } else {
      console.warn('⚠️ CompraService: NO se agregó Authorization header - token faltante');
    }
    
    return headers;
  }

  /**
   * Crear nueva orden (Checkout directo)
   * Endpoint: POST /api/v1/ordenes
   */
  createOrder(orderData: CreateOrderRequest): Observable<CreateOrderResponse> {
    const url = `${baseUrl}/ordenes`;
    const headers = this.getHeaders();

    console.log('🚀 CompraService.createOrder -> POST', url, orderData);

    return this.http.post<CreateOrderResponse>(url, orderData, { headers })
      .pipe(
        tap(response => {
          console.log('✅ CompraService.createOrder response:', response);
        }),
        catchError(error => {
          console.error('❌ CompraService.createOrder error:', error);
          return this.httpUtils.handleError(error);
        })
      );
  }

  /**
   * Registrar pago de una orden
   * Endpoint: POST /api/v1/pagos/registrar
   */
  registerPayment(paymentData: RegisterPaymentRequest): Observable<RegisterPaymentResponse> {
    const url = `${baseUrl}/pagos/registrar`;
    const headers = this.getHeaders();

    console.log('🚀 CompraService.registerPayment -> POST', url, paymentData);

    return this.http.post<RegisterPaymentResponse>(url, paymentData, { headers, observe: 'response' })
      .pipe(
        tap(response => {
          console.log('✅ CompraService.registerPayment response:', response);
        }),
        map((response: HttpResponse<RegisterPaymentResponse>) => response.body as RegisterPaymentResponse),
        catchError(error => {
          console.error('❌ CompraService.registerPayment error:', error);
          return this.httpUtils.handleError(error);
        })
      );
  }

  /**
   * Checkout desde carrito
   * Endpoint: POST /api/v1/ordenes/checkout-carrito/{idCarrito}
   */
  checkoutFromCarrito(idCarrito: number, checkoutData: CheckoutCarritoRequest): Observable<CreateOrderResponse> {
    const url = `${baseUrl}/ordenes/checkout-carrito/${idCarrito}`;
    const headers = this.getHeaders();

    console.log('🚀 CompraService.checkoutFromCarrito -> POST', url, checkoutData);

    return this.http.post<CreateOrderResponse>(url, checkoutData, { headers })
      .pipe(
        tap(response => {
          console.log('✅ CompraService.checkoutFromCarrito response:', response);
        }),
        catchError(error => {
          console.error('❌ CompraService.checkoutFromCarrito error:', error);
          return this.httpUtils.handleError(error);
        })
      );
  }

  /**
   * Validar cupón en el carrito
   * Endpoint: GET /api/v1/ordenes/validar-cupon
   */
  validateCoupon(codigo: string): Observable<any> {
    const url = `${baseUrl}/ordenes/validar-cupon?codigo=${encodeURIComponent(codigo)}`;
    const headers = this.getHeaders();

    console.log('🚀 CompraService.validateCoupon -> GET', url);

    return this.http.get<any>(url, { headers })
      .pipe(
        tap(response => {
          console.log('✅ CompraService.validateCoupon response:', response);
        }),
        catchError(error => {
          console.error('❌ CompraService.validateCoupon error:', error);
          return this.httpUtils.handleError(error);
        })
      );
  }

  /**
   * Obtener comprobante PDF
   * Endpoint: GET /api/v1/ordenes/{idOrden}/comprobante
   */
  getComprobantePdf(idOrden: number): Observable<Blob> {
    const url = `${baseUrl}/ordenes/${encodeURIComponent(String(idOrden))}/comprobante`;
    const headers = this.getHeaders();

    console.log('🚀 CompraService.getComprobantePdf -> GET', url);

    return this.http.get(url, { headers, responseType: 'blob' })
      .pipe(
        tap(blob => {
          console.log('✅ CompraService.getComprobantePdf: received blob', blob);
        }),
        catchError(error => {
          console.error('❌ CompraService.getComprobantePdf error:', error);
          return this.httpUtils.handleError(error);
        })
      );
  }
}