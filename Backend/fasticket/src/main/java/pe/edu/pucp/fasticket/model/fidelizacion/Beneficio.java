package pe.edu.pucp.fasticket.model.fidelizacion;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "beneficio") // Coincide con CREATE TABLE beneficio
public class Beneficio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_beneficio") // Coincide con id_beneficio
    private Integer idBeneficio;

    // Mapeo de ENUM tipo_beneficio
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoBeneficio tipo;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "porcentaje")
    private Double porcentaje;

    @Column(name = "activo")
    private Boolean activo;

    // ManyToOne con Membresia
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_membresia", nullable = false) // Coincide con id_membresia (FK)
    private Membresia membresia;
}