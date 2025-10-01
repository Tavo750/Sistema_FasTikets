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
@Table(name = "carrocompras") // Coincide con CREATE TABLE CarroCompras
public class CarroCompras {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCarroCompra") // Coincide con idCarroCompra SERIAL PRIMARY KEY
    private Integer idCarroCompra;

    // Atributos de Auditoría y Control
    @Column(name = "usuario_creacion")
    private Integer usuarioCreacion;
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    @Column(name = "usuario_actualizacion")
    private Integer usuarioActualizacion;
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    @Column(name = "activo")
    private Boolean activo;

    // Atributos de Carrito
    @Column(name = "tiempoMaxEspera")
    private LocalDateTime tiempoMaxEspera;

    @Column(name = "total")
    private Double total;

    // Relación OneToOne con Cliente (Inversa a la relación en Cliente)
    // Asumimos que CarroCompras tiene una FK a Cliente, aunque no está explícita en tu script
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente") // Asumimos una FK a Cliente en esta tabla
    private Cliente cliente;

    // Relación OneToMany con ItemCarrito
    @OneToMany(mappedBy = "carroCompra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCarrito> items;
}