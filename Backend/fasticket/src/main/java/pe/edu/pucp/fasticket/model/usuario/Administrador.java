package pe.edu.pucp.fasticket.model.usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "administrador") // Coincide con CREATE TABLE administrador
@PrimaryKeyJoinColumn(name = "id_admin") // Coincide con id_admin INT PRIMARY KEY y la FK
public class Administrador extends Persona {

    // Atributos específicos
    @Column(name = "cargo") // Coincide con cargo VARCHAR(100)
    private String cargo;

    // Constructor
    public Administrador() {
        super();
        // this.setRol("ADMINISTRADOR"); // El rol se asigna en la capa de servicio
    }
}