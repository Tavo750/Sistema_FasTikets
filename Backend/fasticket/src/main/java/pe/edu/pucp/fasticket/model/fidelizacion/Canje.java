package pe.edu.pucp.fasticket.model.fidelizacion;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "canje") // Coincide con CREATE TABLE Canje
public class Canje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCanje") // Coincide con idCanje
    private Integer idCanje;

    @Column(name = "fechaCanje")
    private LocalDate fechaCanje;

    @Column(name = "puntosSolicitados")
    private Integer puntosSolicitados;

    @Column(name = "puntosConsumidos")
    private Integer puntosConsumidos;

    @Column(name = "activo")
    private Boolean activo;

    // --- Relaciones ---

    // ManyToOne con ReglaPuntos
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idReglapuntos") // Coincide con idReglapuntos (FK)
    private ReglaPuntos reglaPuntos;

    // OneToMany con CanjeDetalle
    @OneToMany(mappedBy = "canje", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CanjeDetalle> detalles;

    // NOTA: Asumiremos que esta tabla debe tener una FK a Cliente.
    // Como no está en tu SQL, no la incluimos en el mapeo, pero es lógica necesaria.
}