package pe.edu.pucp.fasticket.model.compra;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.usuario.Cliente;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "orden_compra") // Coincide con CREATE TABLE OrdenCompra
public class OrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idOrdenCompra") // Coincide con idOrdenCompra SERIAL PRIMARY KEY
    private Integer idOrdenCompra;

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

    // Atributos de Compra
    @Column(name = "comprobante")
    private String comprobante;

    @Column(name = "fechaOrden")
    private LocalDate fechaOrden;

    @Column(name = "descuentoPorPuntos")
    private Double descuentoPorPuntos;

    @Column(name = "descuentoPorMembresia")
    private Double descuentoPorMembresia;

    @Column(name = "total")
    private Double total;

    // Mapeo de ENUM EstadoCompra
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private String estado;

    // Relación ManyToOne con Cliente (no está en tu SQL, pero es crucial)
    // Asumiremos que OrdenCompra necesita una FK a Cliente para saber quién compró
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false) // Asumimos esta columna como FK a Cliente
    private Cliente cliente;

    // Relación OneToMany con OrderItems (ítems de la orden)
    @OneToMany(mappedBy = "ordenCompra", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItems> items; // Cambiado a OrderItems para coincidir con la tabla OrderItems

    // Relación OneToOne con CarroCompras (asumiendo que es la FK en tu SQL)
    @OneToOne
    @JoinColumn(name = "idCarroCompra") // Coincide con la FK a CarroCompras que sugiere tu SQL
    private CarroCompras carroCompras;
}