package pe.edu.pucp.fasticket.model.compra;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.usuario.Cliente;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "CarroCompras") // Coincide con CREATE TABLE CarroCompras
public class CarroCompras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCarroCompra") // Coincide con idCarroCompra SERIAL PRIMARY KEY
    private Integer idCarroCompra;

    // Atributos de Auditoría y Control
    @Column(name = "usuarioCreacion")
    private Integer usuarioCreacion;
    @Column(name = "fechaCreacion")
    private LocalDateTime fechaCreacion;
    @Column(name = "usuarioActualizacion")
    private Integer usuarioActualizacion;
    @Column(name = "fechaActualizacion")
    private LocalDateTime fechaActualizacion;
    @Column(name = "activo")
    private Boolean activo;

    // Atributos de Carrito
    @Column(name = "tiempoMaxEspera")
    private LocalDateTime tiempoMaxEspera;

    @Column(name = "total")
    private Double total;

    @OneToOne
    @JoinColumn(name="idCliente", nullable=false)
    private Cliente cliente;

    @OneToOne(mappedBy = "carroCompras", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private OrdenCompra ordenCompra;

    @OneToMany(mappedBy = "carroCompras", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCarrito> items;

}