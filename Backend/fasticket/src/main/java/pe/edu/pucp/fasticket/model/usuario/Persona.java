package pe.edu.pucp.fasticket.model.usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
//import java.time.LocalTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "Persona")
@Inheritance(strategy = InheritanceType.JOINED)
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPersona")
    private Integer idPersona;

    @Column(name = "tipoDocumento", length = 20)
    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;

    @Column(name = "numeroDocumento", length = 20, unique = true)
    private String numeroDocumento;

    @Column(name = "nombres", length = 50, nullable = false)
    private String nombres;

    @Column(name = "apellidos", length = 50, nullable = false)
    private String apellidos;

    @Column(name = "telefono", length = 15)
    private String telefono;

    @Column(name = "email", length = 100, unique = true, nullable = false)
    private String email;

    @Column(name = "direccion", length = 200)
    private String direccion;

    @Column(name = "contrasena", length = 255, nullable = false)
    private String contrasena;

    @Column(name = "fechaNacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "rol", length = 50)
    @Enumerated(EnumType.STRING)
    private Rol rol;

    @Column(name = "activo")
    private Boolean activo = true;

    // Campos de auditoría
    @Column(name = "usuarioCreacion")
    private Integer usuarioCreacion;

    @Column(name = "usuarioActualizacion")
    private Integer usuarioActualizacion;

    @Column(name = "fechaCreacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fechaActualizacion")
    private LocalDateTime fechaActualizacion;


}