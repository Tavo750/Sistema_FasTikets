package pe.edu.pucp.fasticket.model.pago;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "comprobantepago") // Coincide con CREATE TABLE ComprobantePago
public class ComprobantePago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idComprobante") // Coincide con idComprobante
    private Integer idComprobante;

    @Column(name = "numero_serie")
    private String numeroSerie;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Column(name = "total")
    private Double total;

    @Column(name = "dni")
    private String dni; // DNI del cliente asociado al comprobante

    // Atributos de Auditoría
    @Column(name = "activo")
    private Boolean activo;
    @Column(name = "usuario_creacion")
    private Integer usuarioCreacion;
    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion;
    @Column(name = "usuario_actualizacion")
    private Integer usuarioActualizacion;
    @Column(name = "fecha_actualizacion")
    private LocalDate fechaActualizacion;

    // --- Relaciones ---

    // OneToOne con Pago (La FK está en esta tabla, debe ser única)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idPago", unique = true) // Coincide con idPago INT UNIQUE (FK)
    private Pago pago;

    // OneToMany con Boleta (Si asumes que un comprobante puede ser Boleta o Factura)
    @OneToMany(mappedBy = "comprobantePago", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Boleta> boletas;
}