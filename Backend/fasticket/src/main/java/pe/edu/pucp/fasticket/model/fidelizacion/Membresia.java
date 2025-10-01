package pe.edu.pucp.fasticket.model.fidelizacion;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "membresia") // Coincide con CREATE TABLE membresia
public class Membresia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_membresia") // Coincide con id_membresia
    private Integer idMembresia;

    // Mapeo de ENUM tipo_membresia
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoMembresia tipo;

    @Column(name = "min_entradas", nullable = false)
    private Integer minEntradas;

    @Column(name = "max_entradas")
    private Integer maxEntradas;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "activo")
    private Boolean activo;

    // OneToMany con Beneficio
    @OneToMany(mappedBy = "membresia", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Beneficio> beneficios;

    // OneToMany con ClienteMembresia
    @OneToMany(mappedBy = "membresia", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClienteMembresia> clientesMembresia;
}