package pe.edu.pucp.fasticket.model.pago;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "pago") // Coincide con CREATE TABLE Pago
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPago") // Coincide con idPago
    private Integer idPago;

    @Column(name = "metodo")
    private String metodo;

    @Column(name = "monto")
    private Double monto;

    @Column(name = "fecha_pago")
    private LocalDate fechaPago;

    // Mapeo de ENUM EstadoPago
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPago estado; // Ej: PENDIENTE, APROBADO, CANCELADO

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

    // OneToOne con ComprobantePago (Inversa, mapeado en ComprobantePago)
    @OneToOne(mappedBy = "pago", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ComprobantePago comprobantePago;

    // NOTA: Se asume que una OrdenCompra referenciará a este Pago.
}