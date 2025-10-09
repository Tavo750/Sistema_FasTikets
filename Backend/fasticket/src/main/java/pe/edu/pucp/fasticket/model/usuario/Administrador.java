package pe.edu.pucp.fasticket.model.usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "administrador")
@PrimaryKeyJoinColumn(name = "id_persona")
public class Administrador extends Persona {

    @Column(name = "cargo", length = 100)
    private String cargo;

    // Constructor
    public Administrador() {
        super();
        // Puedes establecer valores por defecto si es necesario
        this.setRol(Rol.ADMINISTRADOR); // Asignar rol automáticamente
    }
}