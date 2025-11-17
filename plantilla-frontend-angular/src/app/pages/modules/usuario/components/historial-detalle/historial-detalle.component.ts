import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-detalle.component.html',
  styleUrls: ['./historial-detalle.component.css']
})
export class HistorialDetalleComponent implements OnInit {
  purchase: any = null;
  qrImageUrl: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Try to read purchase from navigation state
    const state: any = this.router.getCurrentNavigation()?.extras?.state as any;
    if (state && state.purchase) {
      this.purchase = state.purchase;
      this.normalizePurchase(this.purchase);
      return;
    }

    // Otherwise try to read from history.state (fallback)
    if ((history as any).state && (history as any).state.purchase) {
      this.purchase = (history as any).state.purchase;
      this.normalizePurchase(this.purchase);
      return;
    }

    // If still not available, try id param and show minimal placeholder
    const id = this.route.snapshot.paramMap.get('id');
    // For development: if no state, show a "Transferido" example to test the UI
    if (!id) {
      this.purchase = {
        id: 'T-0001',
        purchaseNumber: '#61601087',
        title: 'Electronic Festival',
        image: '/assets/img/banners/electronic-festival.jpg',
        estado: 'Transferido',
        dateFull: '24/08/2025',
        fechaCompra: '24/08/2025',
        items: [{ qty: 1, desc: 'General', price: 150 }],
        puntosCanjeados: 40,
        puntosObtenidos: 18,
        descuento: 0,
        monto: 150,
        tarjetaMasked: '455788XXXXXX1589',
        detallePago: '#29311205',
        medioPago: 'VISA',
        nombres: 'Comprador Ejemplo',
        dni: '12345678',
        personaTransferida: { nombre: 'Luis Enrique Rios Sosa', dni: '72894616' }
      };
      // normalize the fallback so QR image is attempted as well
      this.normalizePurchase(this.purchase);
    } else {
      this.purchase = { id, purchaseNumber: id ? `#${id}` : 'N/A', title: 'Compra', image: '/assets/img/banners/electronic-festival.jpg' };
      this.normalizePurchase(this.purchase);
    }
  }

  private buildQrImage(): void {
    const code = this.getQrCodeValue();
    if (!code) { this.qrImageUrl = null; return; }
    // Use a public QR generation service (qrserver) to create an image
    this.qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code)}`;
  }

  private getQrCodeValue(): string | null {
    if (!this.purchase) return null;

    // Helper: recursively search an object/array for likely QR code properties
    const candidates = /codigoQr|codigo_qr|codigoQrBase64|codigo|qrCode|qr|codigoQR/i;

    const findIn = (obj: any, depth = 0): string | null => {
      if (!obj || depth > 6) return null;
      if (typeof obj === 'string') {
        // Heuristic: treat non-empty strings as possible QR payloads
        return obj.trim() ? obj : null;
      }
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const found = findIn(item, depth + 1);
          if (found) return found;
        }
        return null;
      }
      if (typeof obj === 'object') {
        // Check direct properties first
        for (const k of Object.keys(obj)) {
          try {
            if (candidates.test(k) && typeof (obj as any)[k] === 'string' && (obj as any)[k].trim()) {
              return (obj as any)[k];
            }
          } catch (e) { /* ignore */ }
        }
        // Then deep-scan properties
        for (const k of Object.keys(obj)) {
          try {
            const found = findIn((obj as any)[k], depth + 1);
            if (found) return found;
          } catch (e) { /* ignore */ }
        }
      }
      return null;
    };

    // Prefer raw then purchase itself
    const src = this.purchase.raw ?? this.purchase;
    const direct = findIn(src);
    if (direct) return direct;

    // Fallback: also inspect top-level purchase.tickets array and items
    if (this.purchase.tickets) {
      const t = findIn(this.purchase.tickets);
      if (t) return t;
    }
    if (this.purchase.items) {
      const it = findIn(this.purchase.items);
      if (it) return it;
    }

    return null;
  }

  /**
   * Normaliza la estructura recibida desde el endpoint de historial
   * para que la plantilla pueda usar las mismas propiedades.
   */
  private normalizePurchase(p: any) {
    if (!p) return;
    // If the caller passed a wrapper with `raw` (historial list), prefer that
    const src = p.raw ?? p;

    // Map idOrdenCompra -> purchaseNumber (detalle de la compra)
    if (src.idOrdenCompra !== undefined) {
      p.purchaseNumber = src.idOrdenCompra;
    } else if (p.id !== undefined) {
      // fallback to mapped id from list
      p.purchaseNumber = p.id;
    }

    // Map fechaOrden -> fechaCompra and dateFull
    if (src.fechaOrden !== undefined) {
      p.fechaCompra = src.fechaOrden;
      p.dateFull = src.fechaOrden;
    }

    // Map total -> monto
    if (src.total !== undefined) {
      p.monto = src.total;
    }

    // Normalize items: cantidad -> qty, tipoTicketNombre -> desc, precioFinal/precio -> price
    const itemsSrc = Array.isArray(src.items) ? src.items : (Array.isArray(p.items) ? p.items : []);
    p.items = itemsSrc.map((it: any) => ({
      qty: it.cantidad ?? it.qty ?? 1,
      desc: it.tipoTicketNombre ?? it.desc ?? it.nombreTicket ?? 'Entrada',
      price: it.precioFinal ?? it.precio ?? it.price ?? 0
    }));

    // Build QR image URL if codigoQr is present
    this.buildQrImage();

    // tickets field can remain as-is
  }

  back() {
    this.router.navigateByUrl('/usuario/historialCompras');
  }

  downloadQr() {
    // Only attempt PDF download. If jspdf is not installed, inform the user.
    if (!this.qrImageUrl) {
      console.log('No hay QR disponible para descargar', this.purchase);
      return;
    }

    this.downloadAsPdf().catch((err) => {
      console.error('Error al generar PDF', err);
      alert('No se pudo generar el PDF. Para habilitar la descarga en PDF instala la dependencia `jspdf` ejecutando:\n\n  npm install jspdf\n\ny luego recarga la aplicación.');
    });
  }

  private async downloadAsPng(): Promise<void> {
    const filename = `QR-${this.purchase?.purchaseNumber ?? this.purchase?.id ?? 'ticket'}.png`;
    try {
      // If qrImageUrl is a data URL, convert to blob directly
      let blob: Blob | null = null;
      if (this.qrImageUrl!.startsWith('data:')) {
        blob = this.dataURLToBlob(this.qrImageUrl!);
      } else {
        const resp = await fetch(this.qrImageUrl!, { mode: 'cors' });
        if (!resp.ok) throw new Error('Error fetching image');
        blob = await resp.blob();
      }
      this.triggerDownload(blob!, filename);
    } catch (e) {
      throw e;
    }
  }

  private async downloadAsPdf(): Promise<void> {
    // Dynamic import of jspdf. If not installed, the caller will catch and show instructions.
    const module = await import('jspdf');
    const { jsPDF } = module as any;

    // Load image as data URL
    const dataUrl = await this.imageUrlToDataUrl(this.qrImageUrl!);

    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    // Calculate dimensions to center the QR on the page
    const pageWidth = (pdf as any).internal.pageSize.getWidth ? (pdf as any).internal.pageSize.getWidth() : (pdf as any).internal.pageSize.width;
    const pageHeight = (pdf as any).internal.pageSize.getHeight ? (pdf as any).internal.pageSize.getHeight() : (pdf as any).internal.pageSize.height;
    const imgWidth = 300; // px
    const imgHeight = 300;
    const marginLeft = (pageWidth - imgWidth) / 2;
    const marginTop = (pageHeight - imgHeight) / 2;

    pdf.addImage(dataUrl, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);
    const filename = `QR-${this.purchase?.purchaseNumber ?? this.purchase?.id ?? 'ticket'}.pdf`;
    pdf.save(filename);
  }

  private triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  private dataURLToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  private imageUrlToDataUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // If already data URL
      if (url.startsWith('data:')) return resolve(url);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('No canvas context'));
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (e) => reject(e);
      img.src = url;
      // If cached images may not fire onload for data urls — handle that by reassigning
      if (img.complete) {
        try { img.onload!(null as any); } catch (e) { /* ignore */ }
      }
    });
  }
}
