package pe.edu.pucp.fasticket.model.geografia;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "provincia") // Coincide con CREATE TABLE provincia
public class Provincia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_provincia") // Coincide con id_provincia
    private Integer idProvincia;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "activo")
    private Boolean activo;

    // ManyToOne con Departamento
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDepartamento", nullable = false) // Coincide con idDepartamento (FK)
    private Departamento departamento;

    // OneToMany con Distrito
    @OneToMany(mappedBy = "provincia", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Distrito> distritos;
}