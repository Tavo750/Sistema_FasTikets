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
@Table(name = "OrdenCompra") // Coincide con CREATE TABLE OrdenCompra
public class OrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idOrdenCompra") // Coincide con idOrdenCompra SERIAL PRIMARY KEY
    private Integer idOrdenCompra;

    // Atributos de Auditoría y Control
    @Column(name = "usuarioCreacion")
    private Integer usuarioCreacion;
    @Column(name = "fechaCreacion")
    private LocalDate fechaCreacion;
    @Column(name = "usuarioActualizacion")
    private Integer usuarioActualizacion;
    @Column(name = "fechaActualizacion")
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
    private EstadoCompra estado;


    @ManyToOne
    @JoinColumn(name = "idCliente", nullable = false)
    private Cliente cliente;

    @OneToOne
    @JoinColumn(name = "idCarroCompras", nullable = false)
    private CarroCompras carroCompras;

}