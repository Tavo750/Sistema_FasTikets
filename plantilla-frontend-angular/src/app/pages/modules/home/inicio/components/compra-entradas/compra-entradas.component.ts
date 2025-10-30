import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseService, PurchaseData } from '../../../../../../shared/services/purchase.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-compra-entradas',
	templateUrl: './compra-entradas.component.html',
	standalone: false,
	styleUrls: ['./compra-entradas.component.css']
})
export class CompraEntradasComponent implements OnInit, OnDestroy {
	// Datos del evento (ahora vienen del servicio)
	event = {
		title: 'Título del evento',
		date: 'Fecha del evento',
		time: 'Hora',
		venue: 'Lugar',
		address: '',
		organizer: '',
		image: ''
	};

	// Datos de compra completos
	purchaseData: PurchaseData | null = null;
	private purchaseSubscription: Subscription = new Subscription();
	// Participantes y tipos de documento
	participants: Array<any> = [];
	docTypes: string[] = ['DNI', 'Pasaporte', 'Carnet Ext.'];

	// Resumen de compra (ahora calculado desde purchaseData)
	get quantity(): number {
		return this.purchaseData?.totalTickets || 0;
	}

	get ticketCategory(): string {
		return this.purchaseData?.tickets[0]?.name || 'General';
	}

	get price(): number {
		return this.purchaseData?.tickets[0]?.price || 0;
	}

	get subtotal(): number {
		return this.purchaseData?.totalPrice || 0;
	}
	usePoints = false;
	pointsToUse = 0;
	remainingPoints = 0;
	totalAmount = 0;
	showPagoDialog: boolean = false;
	showConfirmExitDialog: boolean = false;
	showSuccessDialog: boolean = false;

	constructor(
		private router: Router,
		private purchaseService: PurchaseService
	) {}
	ngOnInit(): void {
		// Suscribirse a los datos de compra
		this.purchaseSubscription = this.purchaseService.purchaseData$.subscribe(
			(data: PurchaseData | null) => {
				if (data) {
					this.purchaseData = data;
					this.updateEventData(data);
					this.initializeParticipants();
					this.calculateTotals();
				} else {
					// Si no hay datos, redirigir o mostrar error
					console.warn('No hay datos de compra disponibles');
					// Opcional: redirigir a home
					// this.router.navigate(['/home']);
				}
			}
		);
	}

	ngOnDestroy(): void {
		// Limpiar suscripciones
		this.purchaseSubscription.unsubscribe();
	}

	private updateEventData(data: PurchaseData): void {
		this.event = {
			title: data.eventInfo.title,
			date: data.eventInfo.date,
			time: data.eventInfo.time,
			venue: data.eventInfo.venue,
			address: data.eventInfo.address,
			organizer: data.eventInfo.organizer,
			image: data.eventInfo.image
		};
	}

	private initializeParticipants(): void {
		// Inicializar participantes según quantity
		this.participants = Array.from({ length: this.quantity }, (_, index) => ({
			ticketType: this.purchaseData?.tickets[Math.floor(index / this.purchaseData.tickets.length)]?.name || 'General',
			autoComplete: false,
			docType: '',
			docNumber: '',
			firstName: '',
			lastName: ''
		}));
	}

	decreasePoints(): void {
		if (this.pointsToUse > 0) {
			this.pointsToUse--;
			this.calculateTotals();
		}
	}
	increasePoints(): void {
		this.pointsToUse++;
		this.calculateTotals();
	}
	onContinuar(): void {
		this.showPagoDialog = true;
	}
	onPagar(): void {
		// Proceso de pago completado: cerrar modal de pago y mostrar éxito
		this.showPagoDialog = false;
		this.showSuccessDialog = true;
	}

	onSuccessOk(): void {
		this.showSuccessDialog = false;
		// Aquí podrías redirigir a home o limpiar el formulario
	}

	onViewDetail(): void {
		// Acción para ver detalle de la compra
		console.log('Ver detalle de la compra');
	}
	onExitConfirm(): void {
		// Lógica al salir: quizá navegar o limpiar estado
		console.log('Usuario confirmó salida, redirigiendo...');
		this.showConfirmExitDialog = false;
	}
	onExitCancel(): void {
		// Cierra el dialogo de confirmación y vuelve al modal de pago o formulario
		//this.showConfirmExitDialog = false;
		this.showPagoDialog = false;
		this.showConfirmExitDialog = true;
	}
	ofExitCancel(): void {
		this.showConfirmExitDialog = false;
		this.showPagoDialog = true;
	}

	private calculateTotals(): void {
		if (!this.purchaseData) return;

		// El subtotal ya viene calculado desde purchaseData
		// Ejemplo sencillo: cada punto = S/1
		this.remainingPoints = 100 - this.pointsToUse;
		this.totalAmount = this.subtotal - this.pointsToUse;
	}

	navigateToHome(): void {
		this.router.navigate(['/home']);
	}
}

