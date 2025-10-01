package pe.edu.pucp.fasticket.model.pago;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "boleta") // Coincide con CREATE TABLE Boleta
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idBoleta") // Coincide con idBoleta
    private Integer idBoleta;

    @Column(name = "dni")
    private String dni;

    @Column(name = "nombreCliente")
    private String nombreCliente;

    // --- Relaciones ---

    // ManyToOne con ComprobantePago
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idComprobante") // Coincide con idComprobante (FK)
    private ComprobantePago comprobantePago;

    // NOTA: Como ComprobantePago es la entidad principal que tiene el Pago,
    // Boleta solo complementa la información del tipo de comprobante.
}