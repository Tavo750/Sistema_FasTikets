package pe.edu.pucp.fasticket.model.fidelizacion;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
//import pe.edu.pucp.fasticket.model.eventos.EstadoTicket;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "puntos") // Coincide con CREATE TABLE Puntos
public class Puntos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPuntos") // Coincide con idPuntos
    private Integer idPuntos;

    @Column(name = "puntosIniciales")
    private Integer puntosIniciales;

    @Column(name = "ganadoEn")
    private LocalDate ganadoEn;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    // Mapeo de ENUM EstadoPuntos
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPuntos estado; // Ej: ACTIVO, VENCIDO, CANJEADO

    @Column(name = "activo")
    private Boolean activo;

    // --- Relaciones ---

    // ManyToOne con ReglaPuntos
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idRegla") // Coincide con idRegla (FK)
    private ReglaPuntos reglaPuntos;

    // NOTA: Asumiremos que esta tabla debe tener una FK a Cliente.
    // Como no está en tu SQL, no la incluimos en el mapeo, pero es lógica necesaria.

    // OneToMany con CanjeDetalle
    // Mapeado en CanjeDetalle
}