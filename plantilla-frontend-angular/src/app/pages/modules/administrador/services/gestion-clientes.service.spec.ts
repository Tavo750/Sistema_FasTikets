import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

import { GestionClientesService } from './gestion-clientes.service';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';

describe('GestionClientesService', () => {
  let service: GestionClientesService;
  let httpMock: HttpTestingController;
  let httpUtilsSpy: jasmine.SpyObj<HttpUtilsService>;

  const mockLista: any = {
    ok: true,
    data: [
      { id: 1, nombre: 'Ana', email: 'ana@lagstore.com', activo: true },
      { id: 2, nombre: 'Luis', email: 'luis@lagstore.com', activo: false },
    ],
  };

  const mockDetalle: any = {
    ok: true,
    data: { id: 2, nombre: 'Luis', email: 'luis@lagstore.com', activo: false },
  };

  beforeEach(() => {
    httpUtilsSpy = jasmine.createSpyObj('HttpUtilsService', ['handleError']);
    httpUtilsSpy.handleError.and.callFake((err: any) => throwError(() => err));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        GestionClientesService,
        { provide: HttpUtilsService, useValue: httpUtilsSpy },
      ],
    });

    service = TestBed.inject(GestionClientesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debe listar clientes (GET /clientes/listar)', () => {
    service.getListarClientes().subscribe((res: any) => {
      expect(res.ok).toBeTrue();
      expect(res.data.length).toBe(2);
      expect(res.data[0].nombre).toBe('Ana');
    });

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/clientes/listar'));
    expect(req.request.method).toBe('GET');
    req.flush(mockLista);
  });

  it('debe obtener cliente por id (GET /clientes/:id/perfil)', () => {
    service.getListarGestionClientesPorId(2).subscribe((res: any) => {
      expect(res.ok).toBeTrue();
      expect(res.data.id).toBe(2);
      expect(res.data.nombre).toBe('Luis');
    });

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/clientes/2/perfil'));
    req.flush(mockDetalle);
  });

  it('debe actualizar cliente (PUT /clientes/:id/perfil)', () => {
    const body: any = { nombre: 'Luis Rios', activo: true };
    const actualizado: any = { ok: true, data: { id: 2, email: 'luis@lagstore.com', ...body } };

    service.putListarClientesPorId(2, body).subscribe((res: any) => {
      expect(res.ok).toBeTrue();
      expect(res.data.id).toBe(2);
      expect(res.data.nombre).toBe('Luis Rios');
      expect(res.data.activo).toBeTrue();
    });

    const req = httpMock.expectOne(r => r.method === 'PUT' && r.url.includes('/clientes/2/perfil'));
    expect(req.request.body).toEqual(body);
    req.flush(actualizado);
  });

  it('debe propagar error 404 en detalle', () => {
    service.getListarGestionClientesPorId(999).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(404);
        expect(httpUtilsSpy.handleError).toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/clientes/999/perfil'));
    req.flush({ message: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
  });
});
