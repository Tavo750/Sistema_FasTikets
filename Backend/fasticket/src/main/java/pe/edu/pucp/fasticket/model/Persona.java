package pe.edu.pucp.fasticket.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
public class Persona {
    @idPersona
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPersona;
    private Integer usuario_creacion, usuario_actualizacion, edad;
    private String docIdentidad, nombres, apellidos,  telefono, email, direccion, contrasena;
    private LocalDate fechaNacimiento, fecha_creacion, fecha_actualizacion;
    private Boolean activo;
    private TipoDocumento tipoDocumento;
    private Rol rol;
}
