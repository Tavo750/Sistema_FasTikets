package pe.edu.pucp.fasticket.model.geografia;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.eventos.Local;
import pe.edu.pucp.fasticket.model.usuario.Persona;

import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "distrito") // Coincide con CREATE TABLE distrito
public class Distrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_distrito") // Coincide con id_distrito
    private Integer idDistrito;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "activo")
    private Boolean activo;

    // ManyToOne con Provincia
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idProvincia", nullable = false) // Coincide con idProvincia (FK)
    private Provincia provincia;

    // OneToMany con Persona
    @OneToMany(mappedBy = "distrito", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Persona> personas;

    // OneToMany con Local
    @OneToMany(mappedBy = "distrito", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Local> locales;
}