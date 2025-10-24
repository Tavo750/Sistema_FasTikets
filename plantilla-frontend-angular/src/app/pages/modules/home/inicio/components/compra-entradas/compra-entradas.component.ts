import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
	selector: 'app-compra-entradas',
	templateUrl: './compra-entradas.component.html',
	standalone: false,
	styleUrls: ['./compra-entradas.component.css']
})
export class CompraEntradasComponent implements OnInit {
	// Datos del evento (podrían venir por @Input o servicio)
	event = {
		title: 'Título del evento',
		date: 'Fecha del evento',
		time: 'Hora',
		venue: 'Lugar'
	};
	// Participantes y tipos de documento
	participants: Array<any> = [];
	docTypes: string[] = ['DNI', 'Pasaporte', 'Carnet Ext.'];
	// Resumen de compra
	quantity = 1;
	ticketCategory = 'VIP';
	price = 0;
	subtotal = 0;
	usePoints = false;
	pointsToUse = 0;
	remainingPoints = 0;
	totalAmount = 0;
	showPagoDialog: boolean = false;
	showConfirmExitDialog: boolean = false;
	showSuccessDialog: boolean = false;

	constructor(private router: Router) {}
	ngOnInit(): void {
		// Inicializar participantes según quantity
		this.participants = Array.from({ length: this.quantity }, () => ({
			ticketType: this.ticketCategory,
			autoComplete: false,
			docType: '',
			docNumber: '',
			firstName: '',
			lastName: ''
		}));
		this.calculateTotals();
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
		this.subtotal = this.price * this.quantity;
		// Ejemplo sencillo: cada punto = S/1
		this.remainingPoints = 100 - this.pointsToUse;
		this.totalAmount = this.subtotal - this.pointsToUse;
	}

	navigateToHome(): void {
		this.router.navigate(['/home']);
	}
}

