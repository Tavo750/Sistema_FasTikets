package pe.edu.pucp.fasticket.model.fidelizacion;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "reglapuntos") // Coincide con CREATE TABLE ReglaPuntos
public class ReglaPuntos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRegla") // Coincide con idRegla
    private Integer idRegla;

    @Column(name = "solesPorPunto")
    private Double solesPorPunto;

    @Column(name = "puntosPorBloque")
    private Integer puntosPorBloque;

    @Column(name = "descuentoPorBloque")
    private Double descuentoPorBloque;

    @Column(name = "estado")
    private String estado;

    @Column(name = "fechaInicioVigencia")
    private LocalDate fechaInicioVigencia;

    @Column(name = "diasVigencia")
    private Integer diasVigencia;

    @Column(name = "activo")
    private Boolean activo;

    // --- Relaciones ---

    // OneToMany con Canje
    @OneToMany(mappedBy = "reglaPuntos", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Canje> canjes;

    // OneToMany con Puntos
    @OneToMany(mappedBy = "reglaPuntos", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Puntos> puntosGenerados;
}