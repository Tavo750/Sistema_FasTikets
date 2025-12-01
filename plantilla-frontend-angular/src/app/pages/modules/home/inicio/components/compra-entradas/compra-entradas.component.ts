import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PurchaseService, PurchaseData } from '../../../../../../shared/services/purchase.service';
import { CartService, CartItem } from '../../../../../../shared/services/cart.service';
import { CarritoService } from '../../../../../../shared/services/carrito.service';
import { SessionService } from '../../../../../../shared/services/session.service';
import { OrdenesService } from '../../../../../../shared/services/ordenes.service';
import { PerfilPersonalService } from '../../../../usuario/services/perfil-personal.service';
import { Subscription } from 'rxjs';
import { baseUrl } from '../../../../../../global';
import { HttpClient } from '@angular/common/http';
import { CartTimerService } from '../../../../../../shared/services/cart-timer.service';
import { CanjePuntosService } from '../../../../../../shared/services/canje-puntos.service';
import { MessageService } from 'primeng/api';

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

	/**
	 * Carga los porcentajes de descuento para membresías desde el backend.
	 * Cada endpoint debe devolver un objeto con `data.value` o `value`.
	 */
	private loadMembershipDiscounts(): void {
		const base = `${baseUrl}/configuracion/`;
		const endpoints = {
			oro: base + 'DSCTO_MEMBRESIA_ORO',
			plata: base + 'DSCTO_MEMBRESIA_PLATA',
			bronce: base + 'DSCTO_MEMBRESIA_BRONCE'
		};

		this.http.get(endpoints.oro).subscribe({
			next: (resp: any) => {
				const raw = this.extractConfigValue(resp);
				this.discountGold = this.normalizePercentage(raw);
				console.debug('DSCTO_MEMBRESIA_ORO ->', this.discountGold);
				this.updateUserLevelDiscount();
				this.calculateTotals();
			},
			error: (err: any) => console.warn('No se pudo obtener DSCTO_MEMBRESIA_ORO', err)
		});

		this.http.get(endpoints.plata).subscribe({
			next: (resp: any) => {
				const raw = this.extractConfigValue(resp);
				this.discountSilver = this.normalizePercentage(raw);
				console.debug('DSCTO_MEMBRESIA_PLATA ->', this.discountSilver);
				this.updateUserLevelDiscount();
				this.calculateTotals();
			},
			error: (err: any) => console.warn('No se pudo obtener DSCTO_MEMBRESIA_PLATA', err)
		});

		this.http.get(endpoints.bronce).subscribe({
			next: (resp: any) => {
				const raw = this.extractConfigValue(resp);
				this.discountBronze = this.normalizePercentage(raw);
				console.debug('DSCTO_MEMBRESIA_BRONCE ->', this.discountBronze);
				this.updateUserLevelDiscount();
				this.calculateTotals();
			},
			error: (err: any) => console.warn('No se pudo obtener DSCTO_MEMBRESIA_BRONCE', err)
		});
	}

	private extractConfigValue(resp: any): any {
		if (!resp) return null;
		return resp?.data?.value ?? resp?.value ?? (typeof resp === 'string' ? resp : null);
	}

	private normalizePercentage(val: any): number | null {
		if (val === null || val === undefined) return null;
		const s = String(val).trim();
		if (s === '') return null;
		const n = Number(s.replace(',', '.'));
		if (isNaN(n)) return null;
		if (n > 1) return n / 100;
		return n;
	}

	/**
	 * Actualiza `userLevelDiscountPercent` de acuerdo al `userLevel` actual
	 * usando los valores remotos si están disponibles.
	 */
	private updateUserLevelDiscount(): void {
		this.userLevelDiscountPercent = this.getDiscountForLevel(this.userLevel) || 0;
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
 
	 showTimer: boolean = false;
	 timerDisplay: string = '';
	 private timerSubscriptions: Subscription[] = [];

	constructor(
		private router: Router,
		private purchaseService: PurchaseService,
		private cartService: CartService,
		private carritoService: CarritoService,
		private sessionService: SessionService,
		private ordenesService: OrdenesService
			, private cartTimerService: CartTimerService,
				private perfilService: PerfilPersonalService,
				private http: HttpClient,
				private canjePuntosService: CanjePuntosService,
				private messageService: MessageService
	) {}

		// Nivel del usuario (ej. ORO, PLATA, BRONCE)
		userLevel: string | null = null;

		// Perfil completo del usuario (cargado desde perfilService)
		userProfile: any = null;
		// Puntos acumulados por el usuario (desde perfil)
		userPoints: number = 0;

		// Descuento asociado al nivel (por ejemplo 0.10 = 10%)
		userLevelDiscountPercent: number = 0;
		levelDiscountAmount: number = 0;

		// Valores remotos de descuento por membresía (null = no cargado)
		discountGold: number | null = null;
		discountSilver: number | null = null;
		discountBronze: number | null = null;

		// Canje de puntos del usuario
		puntosACanjear: number = 0; // Puntos que el usuario quiere canjear
		montoDescuentoPuntos: number = 0; // Descuento calculado por los puntos
		redeemMessage: string | null = null;
		solesPorPunto: number = 1; // Tasa de conversión dinámica
		textoConversionPuntos: string = '1 punto = S/ 1.00'; // Texto para mostrar al usuario

		// UI: canjear puntos mediante checkbox (si true se ocultan otros bloques y total -> 0)
		usePointsRedeem: boolean = false;

		getLevelClass(level: string | null): string {
			if (!level) return '';
			const l = level.toString().toLowerCase();
			if (l.includes('oro') || l.includes('gold')) return 'level-gold';
			if (l.includes('plata') || l.includes('silver')) return 'level-silver';
			if (l.includes('bronce') || l.includes('bronze')) return 'level-bronze';
			return 'level-default';
		}

		/**
		 * Retorna el porcentaje de descuento según el nivel (valor decimal: 0.03 = 3%)
		 */
		getDiscountForLevel(level: string | null): number {
			if (!level) return 0;
			const l = level.toString().toLowerCase();
			if (l.includes('bronce') || l.includes('bronze')) return this.discountBronze ?? 0.03; // 3% fallback
			if (l.includes('plata') || l.includes('silver')) return this.discountSilver ?? 0.05; // 5% fallback
			if (l.includes('oro') || l.includes('gold')) return this.discountGold ?? 0.10; // 10% fallback
			return 0;
		}

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
		// Suscribirse a la tasa de conversión de puntos
		try {
			this.canjePuntosService.solesPorPunto$.subscribe(soles => {
				this.solesPorPunto = soles;
				this.textoConversionPuntos = this.canjePuntosService.getTextoConversion();
				console.log('Tasa de conversión actualizada:', this.textoConversionPuntos);
			});
		} catch (e) { console.warn('No se pudo suscribir a tasa de conversión de puntos', e); }
		// Cargar descuentos de membresía desde configuración remota
		try { this.loadMembershipDiscounts(); } catch (e) { console.warn('No se pudo iniciar carga de descuentos', e); }
		// Suscribirse al temporizador compartido para mostrarlo mientras navegamos
		try {
			this.timerSubscriptions.push(this.cartTimerService.display$.subscribe(d => this.timerDisplay = d));
			this.timerSubscriptions.push(this.cartTimerService.running$.subscribe(r => this.showTimer = r));
			this.timerSubscriptions.push(this.cartTimerService.expired$.subscribe(() => {
				// cuando expira en otra vista podemos mostrar alerta o redirigir
				console.warn('Temporizador de carrito expiró');
			}));
		} catch (e) { console.warn('No se pudo suscribir a CartTimerService', e); }
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
						// Obtener nivel del usuario desde perfil
						try {
							this.perfilService.getobtenerPerfilPorId(currentUser.idUsuario).subscribe({
								next: (resp: any) => {
									const nivel = resp?.data?.nivel ?? resp?.nivel ?? null;
									this.userLevel = nivel;
									// guardar perfil completo para autocompletar participantes
									this.userProfile = resp?.data ?? resp;
									// puntos acumulados reales desde el endpoint
									const puntos = resp?.data?.puntosAcumulados ?? resp?.puntosAcumulados ?? resp?.data?.puntos ?? 0;
									this.userPoints = Number(puntos) || 0;
									// Inicializar remainingPoints y recalcular totales
									this.remainingPoints = Math.max(0, this.userPoints - this.pointsToUse);
									// determinar descuento por nivel
									this.updateUserLevelDiscount();
									this.calculateTotals();
								},
								error: (err: any) => {
									console.warn('No se pudo obtener perfil del cliente', err);
								}
							});
						} catch (e) { console.warn('Error solicitando perfil', e); }
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
								// Iniciar temporizador si hay items en carrito
								try { if (this.cartItems && this.cartItems.length > 0) this.cartTimerService.startIfNotStarted(currentUser.idUsuario); } catch (e) {}
							},
							error: (err: any) => {
								console.warn('No se pudo cargar carrito por cliente, usando items locales', err);
								this.cartItems = this.cartService.getCartItems();
								this.assignParticipantTicketIds();
								this.buildTicketIdsIfReady();
								try { if (this.cartItems && this.cartItems.length > 0) this.cartTimerService.startIfNotStarted(this.sessionService.getCurrentUser()?.idUsuario); } catch (e) {}
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

	/**
	 * Handler cuando se activa/desactiva la casilla "Completar con mis datos" de un participante
	 */
	onParticipantAutoCompleteChange(participant: any, index: number): void {
		if (!participant) return;
		// Si se activa la casilla, completar con los datos del usuario corriente
		if (participant.autoComplete) {
			const currentUser = this.sessionService.getCurrentUser() || {};
			// Preferir valores del perfil cargado (más completos), luego del session user
			const profile = this.userProfile || {};
			const profileAny = profile as any;
			const currentAny = currentUser as any;

			// Nombre / Apellidos
			const firstName = profileAny?.nombres || profileAny?.nombre || currentAny?.nombres || currentAny?.nombre || currentAny?.firstName || '';
			const lastName = profileAny?.apellidos || profileAny?.apellido || currentAny?.apellidos || currentAny?.apellido || currentAny?.lastName || '';

			// Tipo y número de documento
			const docType = profileAny?.tipoDocumento || profileAny?.docType || currentAny?.tipoDocumento || currentAny?.docType || '';
			const docNumber = profileAny?.numeroDocumento || profileAny?.dni || profileAny?.documento || profileAny?.doc_identidad || profileAny?.docIdentidad || currentAny?.numeroDocumento || currentAny?.dni || currentAny?.documento || currentAny?.doc_identidad || currentAny?.docIdentidad || '';

			if (firstName) participant.firstName = firstName;
			if (lastName) participant.lastName = lastName;
			if (docType) participant.docType = docType;
			if (docNumber) participant.docNumber = docNumber;
		} else {
			// Si se desactiva, limpiar los campos (o dejarlos como estaban). Aquí se limpian para evitar datos residuales.
			participant.docType = '';
			participant.docNumber = '';
			participant.firstName = '';
			participant.lastName = '';
		}
	}

	ngOnDestroy(): void {
		// Limpiar suscripciones
		this.purchaseSubscription.unsubscribe();
		try { this.timerSubscriptions.forEach(s => s.unsubscribe()); } catch (e) {}
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
		// No permitir usar más puntos de los que tiene el usuario
		if (this.pointsToUse < this.userPoints) {
			this.pointsToUse++;
			this.calculateTotals();
		} else {
			// opcional: mostrar aviso al usuario
			try { console.warn('No tienes suficientes puntos para aumentar el canje'); } catch (e) {}
		}
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
		console.debug('onPagar invoked');
		this.cardNumberError = null;
		this.expiryError = null;
		this.cvvError = null;

		// Validar formulario y campos de pago antes de llamar a cualquier endpoint
		const orderPayload = this.buildOrderPayload();
		if (!orderPayload) {
			alert('No se pudo construir la orden. Verifique el carrito y los participantes.');
			return;
		}

		// Validaciones cliente: si fallan, no llamamos al backend
		const valid = this.validatePaymentFields(form);
		if (!valid) {
			// validatePaymentFields ahora muestra alert con errores para feedback inmediato
			console.warn('onPagar: validación cliente falló, no se llamará al backend');
			return;
		}

		console.debug('Creando orden con payload:', orderPayload);
		this.isProcessingPayment = true;

		this.ordenesService.createOrder(orderPayload).subscribe({
			next: (resp) => {
				const idOrden = resp?.data?.idOrden ?? resp?.idOrden ?? null;
				this.createdOrderId = idOrden;
				console.debug('Orden creada (idOrden):', idOrden, resp);
				// Informar al usuario que la orden fue creada
				if (idOrden) {
					alert('Orden creada correctamente. idOrden: ' + idOrden);
				} else {
					alert('Orden creada, pero no se recibió idOrden en la respuesta.');
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

				// Aquí ya se asumió que las validaciones precedentes pasaron

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

				console.debug('Llamando a registerPayment con payload:', paymentPayload);
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
		// Ahora validamos exactamente 12 dígitos según requerimiento
		if (!/^[0-9]{12}$/.test(cardNumber)) return false;
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
		// Expect YYYY-MM-DD
		if (!value || typeof value !== 'string') return false;
		const m = /^\s*(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s*$/.exec(value);
		if (!m) return false;
		const year = parseInt(m[1], 10);
		const month = parseInt(m[2], 10);
		const day = parseInt(m[3], 10);
		// Construir fecha y verificar validez (p.ej. 2023-02-30 no válido)
		const dt = new Date(year, month - 1, day);
		if (dt.getFullYear() !== year || dt.getMonth() !== (month - 1) || dt.getDate() !== day) {
			return false;
		}
		const now = new Date();
		// Comparar con fin del día provisto
		const exp = new Date(year, month - 1, day, 23, 59, 59, 999);
		return exp >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}

	onSuccessOk(): void {
		this.showSuccessDialog = false;
		// Redirigir a la página principal (home)
		try {
			this.router.navigate(['/home']);
		} catch (e) {
			console.warn('No se pudo navegar a /home', e);
		}
	}

	onViewDetail(): void {
		// Navegar al detalle de la compra usando el id disponible
		let id: any = null;
		// Preferir el id de la orden creada durante el flujo de pago
		if (this.createdOrderId) id = this.createdOrderId;
		// Fallbacks posibles en purchaseData (si el backend envía otro nombre)
		if (!id && this.purchaseData) {
			id = (this.purchaseData as any).idOrden ?? (this.purchaseData as any).orderId ?? (this.purchaseData as any).idCompra ?? (this.purchaseData as any).id ?? null;
		}
		if (!id) {
			try { alert('No se pudo determinar el id de la compra para ver el detalle.'); } catch (e) {}
			console.warn('onViewDetail: id de compra no disponible', { createdOrderId: this.createdOrderId, purchaseData: this.purchaseData });
			return;
		}
		try {
			// Navegar con el prefijo 'usuario' para coincidir con la ruta esperada
			this.router.navigate(['/usuario', 'historialCompras', 'detalle', id]);
		} catch (e) {
			console.warn('Error navegando a detalle de compra', e);
		}
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

	/**
	 * Cancela la compra y navega al inicio
	 */
	onCancelPurchase(): void {
		// Cerrar el diálogo de pago si está abierto
		this.showPagoDialog = false;
		// Navegar al inicio
		this.router.navigate(['/home']);
	}

	private calculateTotals(): void {
		if (!this.purchaseData) return;

		// Si el usuario decide canjear puntos (modo exclusivo), el total se vuelve 0
		if (this.usePointsRedeem) {
			this.totalAmount = 0;
			return;
		}

		// Calcular descuento por puntos a canjear
		if (this.puntosACanjear > 0) {
			this.montoDescuentoPuntos = this.canjePuntosService.calcularMontoDescuento(this.puntosACanjear);
		} else {
			this.montoDescuentoPuntos = 0;
		}

		// Asegurar que pointsToUse no supere los puntos disponibles
		if (this.pointsToUse > this.userPoints) {
			this.pointsToUse = this.userPoints;
		}

		// Restantes = puntos acumulados - puntos utilizados
		this.remainingPoints = Math.max(0, this.userPoints - this.pointsToUse);

		// Aplicar descuento por nivel de usuario
		this.levelDiscountAmount = (this.subtotal || 0) * (this.userLevelDiscountPercent || 0);

		// Cada punto se considera S/1 por simplicidad (ajustar si la regla cambia)
		this.totalAmount = Math.max(0, this.subtotal - this.pointsToUse - this.montoDescuentoPuntos - this.levelDiscountAmount);
	}

	onToggleRedeemPoints(): void {
		// Llamado cuando el checkbox cambia; recalcular totales y ocultar/desocultar bloques
		this.redeemMessage = null;
		// Si activamos canje por puntos, opcionalmente podemos limpiar descuentos por código o nivel visualmente
		this.calculateTotals();
	}

	/**
	 * Aumenta los puntos a canjear
	 */
	increasePointsRedeem(): void {
		if (this.puntosACanjear < this.userPoints) {
			// Verificar que no supere el subtotal
			const nuevoDescuento = this.canjePuntosService.calcularMontoDescuento(this.puntosACanjear + 1);
			if (nuevoDescuento <= this.subtotal) {
				this.puntosACanjear++;
				this.calculateTotals();
			} else {
				this.messageService.add({
					severity: 'warn',
					summary: 'Límite alcanzado',
					detail: 'El descuento no puede superar el monto total de la compra'
				});
			}
		} else {
			this.messageService.add({
				severity: 'warn',
				summary: 'Puntos insuficientes',
				detail: `Solo tienes ${this.userPoints} puntos disponibles`
			});
		}
	}

	/**
	 * Disminuye los puntos a canjear
	 */
	decreasePointsRedeem(): void {
		if (this.puntosACanjear > 0) {
			this.puntosACanjear--;
			this.calculateTotals();
		}
	}

	/**
	 * Aplica el canje de puntos y valida
	 */
	applyPointsRedeem(): void {
		this.redeemMessage = null;

		if (this.puntosACanjear <= 0) {
			this.messageService.add({
				severity: 'warn',
				summary: 'Cantidad inválida',
				detail: 'Debes seleccionar al menos 1 punto para canjear'
			});
			return;
		}

		// Validar el canje
		const errorValidacion = this.canjePuntosService.validarCanje(
			this.puntosACanjear,
			this.userPoints,
			this.subtotal
		);

		if (errorValidacion) {
			this.messageService.add({
				severity: 'error',
				summary: 'Canje inválido',
				detail: errorValidacion
			});
			return;
		}

		// Aplicar el descuento
		this.montoDescuentoPuntos = this.canjePuntosService.calcularMontoDescuento(this.puntosACanjear);
		this.redeemMessage = `¡${this.puntosACanjear} puntos aplicados! Descuento: S/${this.montoDescuentoPuntos.toFixed(2)}`;
		this.messageService.add({
			severity: 'success',
			summary: 'Puntos aplicados',
			detail: this.redeemMessage
		});
		this.calculateTotals();
	}

	/**
	 * Limpia el canje de puntos
	 */
	clearPointsRedeem(): void {
		this.puntosACanjear = 0;
		this.montoDescuentoPuntos = 0;
		this.redeemMessage = null;
		this.messageService.add({
			severity: 'info',
			summary: 'Canje removido',
			detail: 'Los puntos han sido removidos'
		});
		this.calculateTotals();
	}

	navigateToHome(): void {
		this.router.navigate(['/home']);
	}

	// ============= Métodos de validación para inputs =============
	
	/**
	 * Permite solo números en el input (para CVV)
	 */
	onlyNumbers(event: KeyboardEvent): boolean {
		const charCode = event.which ? event.which : event.keyCode;
		// Permitir solo números (0-9)
		if (charCode < 48 || charCode > 57) {
			event.preventDefault();
			return false;
		}
		return true;
	}

	/**
	 * Permite solo números y espacios (para número de tarjeta)
	 */
	onlyNumbersAndSpaces(event: KeyboardEvent): boolean {
		const charCode = event.which ? event.which : event.keyCode;
		// Permitir números (48-57) y espacio (32)
		if ((charCode < 48 || charCode > 57) && charCode !== 32) {
			event.preventDefault();
			return false;
		}
		return true;
	}

	/**
	 * Permite solo letras, espacios y tildes (para nombre del titular)
	 */
	onlyLettersAndSpaces(event: KeyboardEvent): boolean {
		const char = String.fromCharCode(event.which ? event.which : event.keyCode);
		// Permitir letras a-z, A-Z, espacios, letras con tildes y ñ
		const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]$/;
		if (!regex.test(char)) {
			event.preventDefault();
			return false;
		}
		return true;
	}

	/**
	 * Validación especial para fecha de expiración YYYY-MM-DD
	 * Permite solo números y el carácter - y autoinserta guiones en posiciones correctas
	 */
	onExpiryKeypress(event: KeyboardEvent): boolean {
		const charCode = event.which ? event.which : event.keyCode;
		const currentValue = this.expiry || '';
		// Permitir números (48-57) y guion (45)
		if ((charCode < 48 || charCode > 57) && charCode !== 45) {
			event.preventDefault();
			return false;
		}

		// Auto-agregar guiones después de 4 y 7 caracteres (YYYY- and YYYY-MM-)
		if (charCode !== 45) {
			if (currentValue.length === 4) {
				this.expiry = currentValue + '-';
			} else if (currentValue.length === 7) {
				this.expiry = currentValue + '-';
			}
		}

		// Limitar longitud a 10 (YYYY-MM-DD)
		if (currentValue.length >= 10) {
			event.preventDefault();
			return false;
		}

		return true;
	}

	/**
	 * Maneja el pegado de texto en campos numéricos
	 */
	onPasteNumbers(event: ClipboardEvent, field: string): void {
		event.preventDefault();
		const pastedText = event.clipboardData?.getData('text') || '';
		// Limpiar todo lo que no sea número
		const cleanedText = pastedText.replace(/[^0-9]/g, '');
		
		if (field === 'cardNumber') {
			// Para tarjeta, limitar a 16 dígitos (requerimiento actualizado)
			this.cardNumber = cleanedText.substring(0, 16);
		} else if (field === 'cvv') {
			// Para CVV, limitar a 3 dígitos
			this.cvv = cleanedText.substring(0, 3);
		}
	}

	/**
	 * Valida client-side los campos de pago y setea mensajes de error.
	 * Retorna true si todo es válido, false en caso contrario.
	 */
	private validatePaymentFields(form?: NgForm): boolean {
		let valid = true;
		// marcar controles como tocados para mostrar errores nativos
		if (form) {
			Object.values(form.controls).forEach((c: any) => c.markAsTouched());
		}
		const errors: string[] = [];

		const cardNumClean = (this.cardNumber || '').toString().replace(/\s+/g, '');
		if (!cardNumClean || !/^[0-9]{16}$/.test(cardNumClean)) {
			this.cardNumberError = 'Número debe tener exactamente 16 dígitos';
			errors.push(this.cardNumberError);
			valid = false;
		} else {
			// Aceptar cualquier número que tenga exactamente 16 dígitos (sin Luhn)
			this.cardNumberError = null;
		}

		if (!this.validateExpiry(this.expiry)) {
			this.expiryError = 'Fecha de caducidad inválida o ya vencida';
			errors.push(this.expiryError);
			valid = false;
		} else {
			this.expiryError = null;
		}

		if (!/^[0-9]{3}$/.test(this.cvv)) {
			this.cvvError = 'CVV inválido';
			errors.push(this.cvvError);
			valid = false;
		} else {
			this.cvvError = null;
		}

		if (!this.cardHolder || this.cardHolder.trim().length === 0) {
			const msg = 'Nombre del titular es obligatorio';
			errors.push(msg);
			valid = false;
		}

		if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
			const msg = 'Email inválido u obligatorio';
			errors.push(msg);
			valid = false;
		}

		if (!valid) {
			// Mostrar todos los errores acumulados para feedback inmediato
			try {
				alert('Errores en el formulario:\n- ' + errors.join('\n- '));
			} catch (e) {
				console.warn('No se pudo mostrar alert con errores, logging to console', errors);
			}
			console.warn('validatePaymentFields errors:', errors);
		}

		return valid;
	}

	/**
	 * Enmascara un número de tarjeta conservando los últimos 4 dígitos (para logging seguro)
	 */
	private maskCard(num: string): string {
		if (!num) return '';
		try {
			return num.replace(/\d(?=\d{4})/g, '*');
		} catch (e) {
			return '************';
		}
	}

	/**
	 * Maneja el pegado de texto en el campo de fecha de expiración (YYYY-MM-DD)
	 */
	onPasteExpiry(event: ClipboardEvent): void {
		event.preventDefault();
		const pastedText = event.clipboardData?.getData('text') || '';
		// Limpiar todo lo que no sea número o -
		let cleanedText = pastedText.replace(/[^0-9-]/g, '');
		// Aceptar formatos 8 dígitos (YYYYMMDD) o con guiones YYYY-MM-DD
		if (/^\d{8}$/.test(cleanedText)) {
			cleanedText = cleanedText.substring(0,4) + '-' + cleanedText.substring(4,6) + '-' + cleanedText.substring(6,8);
		}
		if (/^\d{4}-\d{2}-\d{2}$/.test(cleanedText)) {
			this.expiry = cleanedText.substring(0, 10);
		} else {
			// intentar truncar para formar YYYY-MM-DD si es posible
			const digits = cleanedText.replace(/-/g, '');
			if (/^\d{0,8}$/.test(digits)) {
				const y = digits.substring(0,4);
				const m = digits.length >= 6 ? digits.substring(4,6) : '';
				const d = digits.length === 8 ? digits.substring(6,8) : '';
				let result = y;
				if (m) result += '-' + m;
				if (d) result += '-' + d;
				this.expiry = result;
			}
		}
	}

	/**
	 * Maneja el pegado de texto en campos de letras (nombre del titular)
	 */
	onPasteLetters(event: ClipboardEvent): void {
		event.preventDefault();
		const pastedText = event.clipboardData?.getData('text') || '';
		// Limpiar todo lo que no sea letra, espacio o tildes
		const cleanedText = pastedText.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
		this.cardHolder = cleanedText;
	}
}
