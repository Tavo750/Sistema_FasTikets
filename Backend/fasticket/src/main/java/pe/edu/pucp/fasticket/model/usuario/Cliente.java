package pe.edu.pucp.fasticket.model.usuario;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import pe.edu.pucp.fasticket.model.compra.CarroCompras;
import pe.edu.pucp.fasticket.model.compra.OrdenCompra;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "cliente")
@PrimaryKeyJoinColumn(name = "id_persona")  // FK a persona.id_persona
public class Cliente extends Persona {

    // Atributos de Fidelización
    @Enumerated(EnumType.STRING)
    @Column(name = "nivel", length = 20)
    private TipoNivel nivel = TipoNivel.BRONCE;

    @Column(name = "puntos_acumulados")
    private Integer puntosAcumulados = 0;

    // --- Relaciones ---
    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CarroCompras carroCompras;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrdenCompra> ordenesCompra;

    public Cliente() {
        super();
        this.setRol(Rol.CLIENTE);
    }
}