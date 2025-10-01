package pe.edu.pucp.fasticket.model.usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import pe.edu.pucp.fasticket.model.compra.CarroCompras;
import pe.edu.pucp.fasticket.model.compra.OrdenCompra;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "cliente") // Coincide con CREATE TABLE cliente
@PrimaryKeyJoinColumn(name = "id_cliente") // Coincide con id_cliente INT PRIMARY KEY y la FK
public class Cliente extends Persona {

    // Atributos de Fidelización
    @Column(name = "nivel") // Coincide con nivel tipo_nivel
    private TipoNivel nivel;

    @Column(name = "puntos_acumulados") // Coincide con puntos_acumulados
    private Integer puntosAcumulados;

    // --- Relación con Carrito de Compras (OneToOne) ---
    // La tabla SQL es CarroCompras
    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CarroCompras carroCompras; // Nombre de variable ajustado a CarroCompras

    // --- Relación con Compras (Historial) (OneToMany) ---
    // La tabla SQL es OrdenCompra
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrdenCompra> ordenesCompra; // Nombre de variable ajustado a OrdenCompra

    // Constructor
    public Cliente() {
        super();
        this.puntosAcumulados = 0;
    }
}