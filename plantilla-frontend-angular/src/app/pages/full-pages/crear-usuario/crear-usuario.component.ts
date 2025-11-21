import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogTerminosComponent } from './dialog-terminos/dialog-terminos.component';
import { DialogPoliticaComponent } from './dialog-politica/dialog-politica.component';
import { DialogExitosoComponent } from './dialog-exitoso/dialog-exitoso.component';
import { RegistroUsuarioService } from '../../../core/services/registro-usuario.service';
import { RegistroResponse, RegistroUsuario } from '../../../core/interfaces/registro_usuario.interface';
import { TipoDocumento } from '../../../core/interfaces/tipo-documento.enum';
import { MessageService } from '../../../core/services/message.service';
import { Departamento, Distrito, Provincia } from '../../../core/interfaces/ubigeo.interface';


@Component({
  selector: 'app-crear-usuario',
  standalone: false,
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})
export class CrearUsuarioComponent implements OnInit {
  private dialogRef: DynamicDialogRef | undefined;
  registroForm: FormGroup;
  tiposDocumento = Object.values(TipoDocumento);
  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];

  loadingProvincias = false;
  loadingDistritos = false;

  // Dominios permitidos para el correo electrónico
  private dominiosPermitidos = ['gmail.com', 'pucp.edu.pe', 'uni.pe', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'unmsm.edu.pe'];

  /**
   * Validador personalizado para verificar que el dominio del email esté permitido
   */
  validadorDominioEmail = (control: any) => {
    if (!control.value) {
      return null;
    }

    const email = control.value.toLowerCase();
    const dominio = email.split('@')[1];

    if (!dominio || !this.dominiosPermitidos.includes(dominio)) {
      return { dominioNoPermitido: true };
    }

    return null;
  }

  /**
   * Validador personalizado para verificar que la fecha no sea futura
   */
  validadorFechaNoFutura = (control: any) => {
    if (!control.value) {
      return null;
    }

    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo la fecha

    if (fechaSeleccionada > hoy) {
      return { fechaFutura: true };
    }

    return null;
  }

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private registroUsuarioService: RegistroUsuarioService,
    private messageService: MessageService
  ) {
    this.registroForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email, this.validadorDominioEmail]],
      contrasena: ['', Validators.required],
      repitaContrasena: ['', Validators.required],
      fechaNacimiento: ['', [Validators.required, this.validadorFechaNoFutura]],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      tipoDocumento: [TipoDocumento.DNI, Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
    });
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
    this.setupDepartamentoListener();
    this.setupProvinciaListener();
    // Aquí puedes cargar los datos de departamentos y distritos
  }

//=========================== Cargar los datos de departamentos, provincias y distritos ==========
cargarDepartamentos(): void {
  this.registroUsuarioService.getDepartamentos().subscribe({
    next: (response) => {
      if (response.ok && response.data) {
        this.departamentos = response.data;
      } else {
        this.messageService.error(response.mensaje || 'Error al cargar departamentos');
      }
    },
    error: (error) => {
      console.error('Error al cargar departamentos:', error);
      this.messageService.error('Error al cargar departamentos');
    }
  });
}

setupDepartamentoListener(): void {
  this.registroForm.get('departamento')?.valueChanges.subscribe(departamentoId => {
    if (departamentoId) {
      // Resetear provincia y distrito
      this.registroForm.patchValue({
        provincia: '',
        distrito: ''
      });
      this.provincias = [];
      this.distritos = [];

      // Cargar provincias
      this.loadingProvincias = true;
      this.registroUsuarioService.getProvincias(departamentoId).subscribe({
        next: (response) => {
          if (response.ok && response.data) {
            this.provincias = response.data;
          } else {
            console.error('Error al cargar provincias:', response.mensaje);
            this.messageService.error(response.mensaje || 'Error al cargar provincias');
          }
          this.loadingProvincias = false;
        },
        error: (error) => {

          console.error('Error al cargar provincias:', error);
          this.messageService.error('Error al cargar provincias');
          this.loadingProvincias = false;
        }
      });
    }
  });
}
setupProvinciaListener(): void {
  this.registroForm.get('provincia')?.valueChanges.subscribe(provinciaId => {
    if (provinciaId) {
      // Resetear distrito
      this.registroForm.patchValue({ distrito: '' });
      this.distritos = [];

      // Cargar distritos
      this.loadingDistritos = true;
      this.registroUsuarioService.getDistritos(provinciaId).subscribe({
        next: (response) => {
          if (response.ok && response.data) {
            this.distritos = response.data;
          } else {
            console.error('Error al cargar distritos:', response.mensaje);
            this.messageService.error(response.mensaje || 'Error al cargar distritos');
          }
          this.loadingDistritos = false;
        },
        error: (error) => {
          console.error('Error al cargar distritos:', error);
          this.messageService.error('Error al cargar distritos');
          this.loadingDistritos = false;
        }
      });
    }
  });
}




  //=========================== se abre el dialogo de terminos y condiciones ==========
  mostrarTerminos(event: Event): void {
    event.preventDefault();
    this.dialogRef = this.dialogService.open(DialogTerminosComponent, {

      width: '40%',
      contentStyle: { 'max-height': '500px', 'overflow-y': 'auto' },
      baseZIndex: 10000
    });

    this.dialogRef.onClose.subscribe((acepto: boolean) => {
      if (acepto) {
        console.log('Términos aceptados');
      }
    });
  }

  //=========================== se abre el dialogo de politicas de privacidad ==========
    mostrarPoliticas(event: Event): void {
    event.preventDefault();
    this.dialogRef = this.dialogService.open(DialogPoliticaComponent, {

      width: '40%',
      contentStyle: { 'max-height': '500px', 'overflow-y': 'auto' },
      baseZIndex: 10000
    });

    this.dialogRef.onClose.subscribe((acepto: boolean) => {
      if (acepto) {
        console.log('Términos aceptados');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  mostrarDialogExitoso(): void {
    this.dialogRef = this.dialogService.open(DialogExitosoComponent, {
      width: '30%',
      contentStyle: { 'max-height': '500px', 'overflow-y': 'auto' },
      baseZIndex: 10000
    });

    this.dialogRef.onClose.subscribe((result: any) => {
      console.log('Dialog exitoso cerrado');
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      // Verificar que las contraseñas coincidan
      if (this.registroForm.get('contrasena')?.value !== this.registroForm.get('repitaContrasena')?.value) {
        this.messageService.error('Las contraseñas no coinciden');
        return;
      }

      // Formatear la fecha de nacimiento a ISO string si es un objeto Date
      const fechaNacimiento = this.registroForm.get('fechaNacimiento')?.value;
      const fechaFormateada = fechaNacimiento instanceof Date ?
        fechaNacimiento.toISOString().split('T')[0] : fechaNacimiento;

      const email = this.registroForm.get('correo')?.value.trim().toLowerCase();

      const usuario: RegistroUsuario = {
        tipoDocumento: this.registroForm.get('tipoDocumento')?.value,
        docIdentidad: this.registroForm.get('numeroDocumento')?.value.trim(),
        nombres: this.registroForm.get('nombres')?.value.trim(),
        apellidos: this.registroForm.get('apellidos')?.value.trim(),
        email: email,
        contrasena: this.registroForm.get('contrasena')?.value,
        telefono: this.registroForm.get('telefono')?.value.trim(),
        fechaNacimiento: fechaFormateada,
        direccion: this.registroForm.get('direccion')?.value.trim(),
        idDistrito: parseInt(this.registroForm.get('distrito')?.value) || 1   // aqui se debe cambiar por el id del distrito seleccionado
      };

      // Validar que todos los campos requeridos tengan valor
      for (const [key, value] of Object.entries(usuario)) {
        if (!value && value !== 0) {
          this.messageService.error(`El campo ${key} es requerido`);
          return;
        }
      }

      this.registroUsuarioService.postRegistro(usuario).subscribe({
        next: (response: any) => {
          // Verificar si la respuesta tiene la estructura esperada
          if (response && typeof response === 'object') {
            if (response.ok && response.data && response.data.exito) {
              this.messageService.success(response.data.mensaje || 'Usuario registrado exitosamente');
              this.mostrarDialogExitoso();
              this.registroForm.reset();
            } else if (response.ok === false) {
              this.messageService.error(response.data?.mensaje || response.mensaje || 'Error en el registro');
            } else {
              // Respuesta exitosa pero estructura diferente
              this.messageService.success('Usuario registrado exitosamente');
              this.mostrarDialogExitoso();
              this.registroForm.reset();
            }
          } else {
            // Respuesta exitosa sin estructura JSON (posible texto plano)
            this.messageService.success('Usuario registrado exitosamente');
            this.mostrarDialogExitoso();
            this.registroForm.reset();
          }
        },
        error: (error) => {
          let mensajeError = 'Error en el registro';

          // Si el error tiene estructura de respuesta HTTP
          if (error?.error) {
            mensajeError = error.error.mensaje || error.error.message || mensajeError;
          } else if (error?.mensaje) {
            mensajeError = error.mensaje;
          } else if (error?.message) {
            mensajeError = error.message;
          }

          this.messageService.error(mensajeError);
        },
      });
    } else {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        if (control?.errors) {
          let errorMessage = '';
          if (control.errors['required']) {
            switch(key) {
              case 'nombres':
                errorMessage = 'El campo Nombres es obligatorio';
                break;
              case 'apellidos':
                errorMessage = 'El campo Apellidos es obligatorio';
                break;
              case 'correo':
                errorMessage = 'El campo Correo Electrónico es obligatorio';
                break;
              case 'contrasena':
                errorMessage = 'El campo Contraseña es obligatorio';
                break;
              case 'repitaContrasena':
                errorMessage = 'Debe repetir la contraseña';
                break;
              case 'fechaNacimiento':
                errorMessage = 'La Fecha de Nacimiento es obligatoria';
                break;
              case 'departamento':
                errorMessage = 'Debe seleccionar un Departamento';
                break;
              case 'provincia':
                errorMessage = 'Debe seleccionar una Provincia';
                break;
              case 'distrito':
                errorMessage = 'Debe seleccionar un Distrito';
                break;
              case 'direccion':
                errorMessage = 'La Dirección es obligatoria';
                break;
              case 'telefono':
                errorMessage = 'El Número de Teléfono es obligatorio';
                break;
              case 'tipoDocumento':
                errorMessage = 'Debe seleccionar un Tipo de Documento';
                break;
              case 'numeroDocumento':
                errorMessage = 'El Número de Documento es obligatorio';
                break;
              default:
                errorMessage = 'Este campo es obligatorio';
            }
          } else if (control.errors['email']) {
            errorMessage = 'El formato del correo electrónico no es válido';
          } else if (control.errors['dominioNoPermitido']) {
            errorMessage = 'El dominio del correo no está permitido. Use: gmail.com, pucp.edu.pe, uni.pe, hotmail.com, yahoo.com, outlook.com, icloud.com o unmsm.edu.pe';
          } else if (control.errors['fechaFutura']) {
            errorMessage = 'La fecha de nacimiento no puede ser una fecha futura';
          } else if (control.errors['pattern']) {
            if (key === 'numeroDocumento') {
              errorMessage = 'El número de documento debe tener exactamente 8 dígitos numéricos';
            } else if (key === 'telefono') {
              errorMessage = 'El número de teléfono debe tener exactamente 9 dígitos numéricos';
            }
          }
          this.messageService.error(errorMessage);
        }
        control?.markAsTouched();
      });
    }
  }

  /**
   * Permite solo números en el input
   * @param event Evento de teclado
   */
  onlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(charCode) !== -1 ||
        // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (charCode === 65 && event.ctrlKey === true) ||
        (charCode === 67 && event.ctrlKey === true) ||
        (charCode === 86 && event.ctrlKey === true) ||
        (charCode === 88 && event.ctrlKey === true)) {
      return;
    }
    // Asegurar que solo sea un número
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  /**
   * Maneja el evento paste para asegurar solo números
   * @param event Evento de pegado
   * @param fieldName Nombre del campo
   */
  onPaste(event: ClipboardEvent, fieldName: string): void {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';

    // Filtrar solo números
    const numbersOnly = clipboardData.replace(/[^0-9]/g, '');

    // Aplicar límite según el campo
    let maxLength = 0;
    if (fieldName === 'telefono') {
      maxLength = 9;
    } else if (fieldName === 'numeroDocumento') {
      maxLength = 8;
    }

    const limitedValue = numbersOnly.substring(0, maxLength);

    // Actualizar el valor del formulario
    this.registroForm.get(fieldName)?.setValue(limitedValue);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }


}
