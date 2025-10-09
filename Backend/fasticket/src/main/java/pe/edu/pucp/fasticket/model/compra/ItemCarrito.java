package pe.edu.pucp.fasticket.model.compra;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.eventos.Ticket;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "itemcarrito") // Coincide con CREATE TABLE ItemCarrito
public class ItemCarrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idItemCarrito") // Coincide con idItemCarrito SERIAL PRIMARY KEY
    private Integer idItemCarrito;

    // Atributos de Auditoría y Control
    @Column(name = "usuario_creacion")
    private Integer usuarioCreacion;
    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion;
    @Column(name = "usuario_actualizacion")
    private Integer usuarioActualizacion;
    @Column(name = "fecha_actualizacion")
    private LocalDate fechaActualizacion;
    @Column(name = "activo")
    private Boolean activo;

    // Atributos Propios
    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "precioUnitario")
    private Double precioUnitario; // Coincide con precioUnitario

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCarritoCompras")  // Tú decides el nombre de la FK
    private CarroCompras carroCompras;

    // --- Relación ManyToOne con Ticket ---
    // Asumiremos que ItemCarrito se relaciona con Ticket (la clase de tu UML)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ticket") // Asumimos esta FK para saber qué ticket se está comprando
    private Ticket ticket; // Nota: Necesitarás crear la clase Ticket.
}