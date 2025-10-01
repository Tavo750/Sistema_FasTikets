package pe.edu.pucp.fasticket.model.eventos;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.compra.OrdenCompra;
import pe.edu.pucp.fasticket.model.usuario.Cliente;

@Data
@NoArgsConstructor
@Entity
@Table(name = "ticket") // Coincide con CREATE TABLE Ticket
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTicket") // Coincide con idTicket SERIAL PRIMARY KEY
    private Integer idTicket;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Lob // Para manejar datos binarios grandes (QR)
    @Column(name = "codigoQR")
    private byte[] codigoQR;

    @Column(name = "precio")
    private Double precio; // Precio unitario final del ticket

    // NOTA: 'stock' es inusual en un ticket individual (unidad).
    // Mantenido para coincidir con tu SQL.
    @Column(name = "stock")
    private Integer stock;

    @Column(name = "activo")
    private Boolean activo;

    // Mapeo de ENUM TipoEstadoTiket
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private String estado; // Ej: DISPONIBLE, VENDIDA, TRANSFERIDA (RF-098)

    // --- Relaciones ---

    // ManyToOne con Evento (Un ticket es para un evento)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idEvento", nullable = false) // Coincide con fk_evento
    private Evento evento;

    // ManyToOne con OrdenCompra (Un ticket se vendió en una orden)
    // Asumimos que la relación está con OrderItems o directamente con Compra
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idOrdenCompra") // Asumimos esta FK para ligar al historial de compra
    private OrdenCompra ordenCompra;

    // ManyToOne con Cliente (Dueño actual del ticket)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idClienteActual") // Asumimos una FK para el dueño actual (para transferencias)
    private Cliente clienteActual;
}