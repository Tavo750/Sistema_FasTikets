package pe.edu.pucp.fasticket.model.usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
public class Persona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPersona;
    private Integer usuario_creacion, usuario_actualizacion;
    private String docIdentidad, nombres, apellidos,  telefono, email, direccion, contrasena;
    private LocalDate fechaNacimiento, fecha_creacion, fecha_actualizacion;
    private Boolean activo;
    
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(50)")
    private TipoDocumento tipoDocumento;
    
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(50)")
    private Rol rol;
}
