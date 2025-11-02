import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { DetalleRegistroPromoComponent } from './detalle-registro-promo.component';
import { CodigosPromocionalesService } from '../../../services/codigos-promocionales.service';
import { HttpUtilsService } from '../../../../../../shared/services/http-utils.service';

describe('DetalleRegistroPromoComponent', () => {
  let component: DetalleRegistroPromoComponent;
  let fixture: ComponentFixture<DetalleRegistroPromoComponent>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCodigosPromocionalesService: jasmine.SpyObj<CodigosPromocionalesService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    // Crear mocks
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [''], {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    });
    
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockCodigosPromocionalesService = jasmine.createSpyObj('CodigosPromocionalesService', ['getListarCodigosPromocionalesPorId']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    
    // Configurar respuesta por defecto del servicio
    mockCodigosPromocionalesService.getListarCodigosPromocionalesPorId.and.returnValue(
      of({ ok: true, data: { id: 1, nombre: 'Test' } } as any)
    );

    await TestBed.configureTestingModule({
      declarations: [DetalleRegistroPromoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: CodigosPromocionalesService, useValue: mockCodigosPromocionalesService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: HttpUtilsService, useValue: jasmine.createSpyObj('HttpUtilsService', ['handleError']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleRegistroPromoComponent);
    component = fixture.componentInstance;
    
    // Initialize component data BEFORE detectChanges to prevent template errors
    component.data = {
      id: 1,
      codigo: 'TEST',
      descripcion: 'Test Description',
      fechaFin: new Date('2024-12-31T23:59:59.000Z'),
      tipo: 'PORCENTAJE',
      valor: 10,
      stock: 100, // Ensure this is a proper number that can call .toString()
      cantidadPorCliente: 1,
      fechaInicio: new Date('2024-01-01T00:00:00.000Z'),
      activo: true,
      fechaCreacion: new Date('2024-01-01T00:00:00.000Z'),
      fechaActualizacion: new Date('2024-01-01T00:00:00.000Z')
    } as any;
    
    // Prevent HTTP calls during ngOnInit
    spyOn(component as any, 'cargarDetalle').and.stub();
    spyOn(component as any, 'mostrarError').and.stub();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
