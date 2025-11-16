import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PurchaseService, PurchaseData } from '../../../../../../shared/services/purchase.service';
import { CartService, CartItem } from '../../../../../../shared/services/cart.service';
import { CarritoService } from '../../../../../../shared/services/carrito.service';
import { SessionService } from '../../../../../../shared/services/session.service';
import { OrdenesService } from '../../../../../../shared/services/ordenes.service';
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

	// Items actuales del carrito (para mostrar idTipoTicket)
	cartItems: CartItem[] = [];

	// id de la orden creada en el backend (se usa luego para registrar el pago)
	createdOrderId: number | null = null;

	isProcessingPayment: boolean = false;

	// Mapeo de idTipoTicket por índice de ticket en purchaseData.tickets
	ticketIds: Array<number | null> = [];

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
		private purchaseService: PurchaseService,
		private cartService: CartService,
		private carritoService: CarritoService,
		private sessionService: SessionService,
		private ordenesService: OrdenesService
	) {}

	// Payment form model
	cardNumber: string = '';
	expiry: string = '';
	cvv: string = '';
	cardHolder: string = '';
	email: string = '';
	installments: string = 'Sin cuotas';

	// Validation flags/messages
	cardNumberError: string | null = null;
	expiryError: string | null = null;
	cvvError: string | null = null;
	ngOnInit(): void {
		// Suscribirse a los datos de compra
		this.purchaseSubscription = this.purchaseService.purchaseData$.subscribe(
			(data: PurchaseData | null) => {
				if (data) {
					this.purchaseData = data;
					this.updateEventData(data);
					this.initializeParticipants();
					this.calculateTotals();
					// Obtener items del carrito desde el servidor para mostrar idTipoTicket
					const currentUser = this.sessionService.getCurrentUser();
					if (currentUser && currentUser.idUsuario) {
						this.carritoService.getCartByCliente(currentUser.idUsuario).subscribe({
							next: (resp: any) => {
								// Manejar la forma { ok, mensaje, data: { items: [...] } } o { items: [...] }
								const itemsResp: any[] = resp?.data?.items ?? resp?.items ?? [];
								this.cartItems = itemsResp.map(it => ({
									// Acomodar a la interfaz CartItem esperada por el frontend
									id: it.idItemCarrito ?? 0,
									title: it.nombreTicket,
									category: it.nombreTicket,
									price: it.precioUnitario,
									quantity: it.cantidad,
									image: '',
									// campos adicionales
									idTipoTicket: it.idTipoTicket,
									subtotal: it.subtotal,
									serverId: it.idItemCarrito
								} as unknown as CartItem));
								this.assignParticipantTicketIds();
								this.buildTicketIdsIfReady();
							},
							error: (err: any) => {
								console.warn('No se pudo cargar carrito por cliente, usando items locales', err);
								this.cartItems = this.cartService.getCartItems();
								this.assignParticipantTicketIds();
								this.buildTicketIdsIfReady();
							}
						});
					} else {
						// Fallback: usar items locales
						this.cartItems = this.cartService.getCartItems();
						this.assignParticipantTicketIds();
						this.buildTicketIdsIfReady();
					}
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

		// Intentar asignar idTipoTicket a cada participante si ya conocemos los items del carrito
		this.assignParticipantTicketIds();
	}

	/**
	 * Asigna a cada participante el idTipoTicket correspondiente según el orden y cantidades
	 */
	private assignParticipantTicketIds(): void {
		if (!this.participants || this.participants.length === 0) return;
		if (!this.cartItems || this.cartItems.length === 0) return;

		let idx = 0;
		for (const ci of this.cartItems) {
			const tipoId = (ci as any).idTipoTicket || ci.serverId || ci.id;
			const qty = ci.quantity || 1;
			for (let i = 0; i < qty; i++) {
				if (idx >= this.participants.length) break;
				this.participants[idx].idTipoTicket = tipoId;
				// also keep readable ticketType if present
				this.participants[idx].ticketType = this.participants[idx].ticketType || ci.category || ci.ticketType || ci.title;
				idx++;
			}
		}
	}

	/**
	 * Construye el arreglo `ticketIds` alineado con `purchaseData.tickets`.
	 * Para cada ticket en purchaseData intentamos encontrar un item del carrito
	 * que coincida por categoría/nombre y tomamos su `idTipoTicket` (o serverId/id).
	 */
	private buildTicketIdsIfReady(): void {
		if (!this.purchaseData || !this.purchaseData.tickets || !this.cartItems) return;
		const ids: Array<number | null> = [];
		// Hacemos una copia mutable de cartItems para marcar usados
		const remaining = this.cartItems.map(ci => ({ ...ci } as any));

		for (const t of this.purchaseData.tickets) {
			let foundId: number | null = null;
			// Buscar primer item cuya categoría o title coincida con t.name
			const idx = remaining.findIndex((ci: any) => {
				const cat = (ci.category || ci.ticketType || ci.title || '').toString().toLowerCase();
				const tname = (t.name || '').toString().toLowerCase();
				return cat === tname || cat.includes(tname) || tname.includes(cat);
			});
			if (idx !== -1) {
				const ci = remaining[idx] as any;
				foundId = ci.idTipoTicket || ci.serverId || ci.id || null;
				// Reducir cantidad en remaining; si quantity >1 decrementar, si 1 eliminar
				if (ci.quantity && ci.quantity > 1) {
					ci.quantity = ci.quantity - 1;
					remaining[idx] = ci;
				} else {
					remaining.splice(idx, 1);
				}
			}
			ids.push(foundId);
		}
		this.ticketIds = ids;
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
		// Validate participants first
		for (let i = 0; i < this.participants.length; i++) {
			const p = this.participants[i];
			if (!p.docType || !p.docNumber || !p.firstName || !p.lastName) {
				console.warn('Faltan datos en participante', i, p);
				alert('Por favor, complete todos los datos de los participantes antes de continuar.');
				return;
			}
		}

		// Build payload from cart items and participants
		// Al presionar "Continuar" sólo validamos los participantes y abrimos el diálogo de pago.
		// La creación de la orden y el registro del pago se hará cuando el usuario confirme "PAGAR".
		this.showPagoDialog = true;
	}

	// Helper que construye el payload de la orden a partir del carrito y participantes
	private buildOrderPayload(): any {
		const currentUser = this.sessionService.getCurrentUser();
		if (!currentUser) return null;
		const cartItems = (this.cartItems && this.cartItems.length) ? this.cartItems : this.cartService.getCartItems();
		if (!cartItems || cartItems.length === 0) return null;

		let participantIndex = 0;
		const items: any[] = [];
		for (const ci of cartItems) {
			const asistentes = (this.participants || []).slice(participantIndex, participantIndex + (ci.quantity || 1)).map((pt: any) => ({
				tipoDocumento: pt.docType,
				numeroDocumento: pt.docNumber,
				nombres: pt.firstName,
				apellidos: pt.lastName
			}));
			participantIndex += (ci.quantity || 1);

			items.push({
				idTipoTicket: (ci as any).idTipoTicket || ci.serverId || ci.id,
				cantidad: ci.quantity,
				asistentes
			});
		}

		return {
			idCliente: currentUser.idUsuario,
			items
		};
	}

	// Submit handler with optional form parameter
	onPagar(form?: NgForm): void {
		this.cardNumberError = null;
		this.expiryError = null;
		this.cvvError = null;

		// If no form provided, keep legacy behaviour: do nothing
		// Construir y enviar la orden al backend con los asistentes y idTipoTicket
		const orderPayload = this.buildOrderPayload();
		if (!orderPayload) {
			alert('No se pudo construir la orden. Verifique el carrito y los participantes.');
			return;
		}

		console.debug('Creando orden con payload:', orderPayload);
		this.isProcessingPayment = true;

		this.ordenesService.createOrder(orderPayload).subscribe({
			next: (resp) => {
				const idOrden = resp?.data?.idOrden ?? resp?.idOrden ?? null;
				this.createdOrderId = idOrden;
				console.debug('Orden creada (raw response):', resp);
				console.debug('Orden creada (idOrden extracted):', idOrden);
				// Informar al usuario que la orden fue creada
				if (idOrden !== null && idOrden !== undefined) {
					alert('Orden creada correctamente. idOrden: ' + idOrden);
				} else {
					alert('Orden creada, pero no se recibió idOrden en la respuesta. No se registrará el pago.');
					this.isProcessingPayment = false;
					return;
				}

				// Intentamos validar el formulario de pago, pero incluso si hay errores
				// procederemos a llamar al endpoint de registro de pago para que el backend
				// nos devuelva el motivo del fallo si aplica. Marcamos controles y errores
				// para UX, pero no abortamos la secuencia aquí.
				if (!form) {
					console.debug('onPagar: no se recibió NgForm, continuando para llamar registerPayment con campos actuales');
				} else {
					if (form.invalid) {
						Object.values(form.controls).forEach((c: any) => c.markAsTouched());
						console.warn('onPagar: form inválido, pero se intentará registrar el pago para depuración');
					}
				}

				// Validaciones cliente (establecen mensajes) — no abortan la llamada
				if (!this.luhnCheck(this.cardNumber.replace(/\s+/g, ''))) {
					this.cardNumberError = 'Número de tarjeta inválido';
					console.warn('onPagar: Luhn inválido, se enviará de todas formas');
				}

				if (!this.validateExpiry(this.expiry)) {
					this.expiryError = 'Fecha de caducidad inválida o ya vencida';
					console.warn('onPagar: expiry inválido, se enviará de todas formas');
				}

				if (!/^[0-9]{3}$/.test(this.cvv)) {
					this.cvvError = 'CVV inválido';
					console.warn('onPagar: CVV inválido, se enviará de todas formas');
				}

				// Determinar número de cuotas: 'Sin cuotas' => 0, '3 cuotas' => 3, '6 cuotas' => 6
				let numeroCuotas = 0;
				if (this.installments && typeof this.installments === 'string') {
					const m = this.installments.match(/(\d+)/);
					numeroCuotas = m ? parseInt(m[0], 10) : (this.installments === 'Sin cuotas' ? 0 : 0);
				}

				const paymentPayload = {
					idOrden: this.createdOrderId,
					nombreTitular: this.cardHolder,
					correo: this.email,
					numeroTarjeta: (this.cardNumber || '').toString().replace(/\s+/g, ''),
					fechaCaducidad: this.expiry,
					cvv: this.cvv,
					numeroCuotas: numeroCuotas,
					monto: this.totalAmount,
					idUsuario: this.sessionService.getCurrentUser()?.idUsuario
				};

				console.debug('Llamando a registerPayment con payload (idOrden):', paymentPayload.idOrden, paymentPayload);
				// Asegurarse de que idOrden no es nulo antes de llamar al endpoint
				if (paymentPayload.idOrden === null || paymentPayload.idOrden === undefined) {
					this.isProcessingPayment = false;
					alert('No se puede registrar el pago: idOrden inválido.');
					return;
				}

				this.ordenesService.registerPayment(paymentPayload).subscribe({
					next: (resp2) => {
						console.debug('Pago registrado', resp2);
						this.isProcessingPayment = false;
						this.showPagoDialog = false;
						const mensaje = resp2?.mensaje || resp2?.data?.mensaje || 'Pago registrado correctamente';
						if (resp2?.ok === false) {
							alert(mensaje || 'El pago no pudo completarse');
						} else {
							alert(mensaje || 'Pago completado con éxito');
							this.showSuccessDialog = true;
						}
					},
					error: (err2) => {
						console.error('Error registrando pago', err2);
						this.isProcessingPayment = false;
						// El HttpUtilsService devuelve un objeto de error estructurado; mostrarlo para debugging
						const serverMsg = err2?.message || err2?.statusText || JSON.stringify(err2);
						alert(serverMsg);
					}
				});
			},
			error: (err) => {
				console.error('Error creando orden antes de pago', err);
				this.isProcessingPayment = false;
				alert('Ocurrió un error al crear la orden. Por favor intente de nuevo.');
			}
		});
	}

	private luhnCheck(cardNumber: string): boolean {
		if (!/^[0-9]{13,19}$/.test(cardNumber)) return false;
		let sum = 0;
		let shouldDouble = false;
		for (let i = cardNumber.length - 1; i >= 0; i--) {
			let digit = parseInt(cardNumber.charAt(i), 10);
			if (shouldDouble) {
				digit *= 2;
				if (digit > 9) digit -= 9;
			}
			sum += digit;
			shouldDouble = !shouldDouble;
		}
		return sum % 10 === 0;
	}

	private validateExpiry(value: string): boolean {
		// Expect MM/AA
		const m = /^\s*(0[1-9]|1[0-2])\/(\d{2})\s*$/.exec(value);
		if (!m) return false;
		const month = parseInt(m[1], 10);
		const year = parseInt(m[2], 10) + 2000;
		const now = new Date();
		const exp = new Date(year, month, 0, 23, 59, 59, 999); // last day of month
		return exp >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
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

