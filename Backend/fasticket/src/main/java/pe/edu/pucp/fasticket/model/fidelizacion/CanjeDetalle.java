package pe.edu.pucp.fasticket.model.fidelizacion;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
// Define la clase que contiene los campos que serán la clave primaria compuesta
@IdClass(CanjeDetalle.CanjeDetalleId.class)
@Entity
@Table(name = "canjedetalle") // Coincide con CREATE TABLE CanjeDetalle
public class CanjeDetalle {

    // Clave primaria compuesta (Parte 1)
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idPuntos") // Coincide con idPuntos (FK)
    private Puntos puntos;

    // Clave primaria compuesta (Parte 2)
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCanje") // Coincide con idCanje (FK)
    private Canje canje;

    @Column(name = "puntosUsados")
    private Integer puntosUsados;

    // Clase interna para la clave primaria compuesta
    @Data
    @NoArgsConstructor
    public static class CanjeDetalleId implements Serializable {
        private Integer puntos; // Debe coincidir con el tipo de la FK (Puntos)
        private Integer canje;  // Debe coincidir con el tipo de la FK (Canje)
    }
}