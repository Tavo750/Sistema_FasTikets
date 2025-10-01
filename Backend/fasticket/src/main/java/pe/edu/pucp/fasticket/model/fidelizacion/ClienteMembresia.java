package pe.edu.pucp.fasticket.model.fidelizacion;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.usuario.Cliente;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "cliente_membresia") // Coincide con CREATE TABLE cliente_membresia
public class ClienteMembresia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente_membresia")
    private Integer idClienteMembresia;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "activo")
    private Boolean activo;

    // Mapeo de ENUM estado_membresia_cliente
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoMembresiaCliente estado;

    // ManyToOne con Cliente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    // ManyToOne con Membresia
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_membresia", nullable = false)
    private Membresia membresia;
}