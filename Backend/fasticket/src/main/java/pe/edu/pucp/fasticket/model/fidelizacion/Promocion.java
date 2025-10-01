package pe.edu.pucp.fasticket.model.fidelizacion;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.eventos.CategoriaEntrada;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
// Usaremos un nombre genérico. Si necesitas mapearla a ReglaPuntos,
// se necesitaría una reestructuración de esa clase en el SQL.
@Table(name = "promocion")
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promocion")
    private Integer idPromocion;

    // --- Atributos del Descuento ---

    @Column(name = "nombre", nullable = false)
    private String nombre; // Ej: 10% OFF Venta Flash

    @Column(name = "codigo_descuento", unique = true)
    private String codigoDescuento; // Ej: VERANO10

    // Mapeamos el descuento como porcentaje
    @Column(name = "porcentaje_descuento")
    private Double porcentajeDescuento;

    @Column(name = "monto_fijo_descuento")
    private Double montoFijoDescuento; // Para descuentos de S/10, S/20, etc.

    // --- Atributos de Vigencia (Similares a ReglaPuntos) ---

    @Column(name = "fecha_inicio_vigencia") // Similar a fechaInicioVigencia de ReglaPuntos
    private LocalDate fechaInicioVigencia;

    @Column(name = "fecha_fin_vigencia")
    private LocalDate fechaFinVigencia; // Calculado o explícito

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    // --- Relaciones ---

    // ManyToMany con CategoriaEntrada (Una promoción aplica a varias categorías de entrada)
    @ManyToMany(mappedBy = "promocionesAplicables", fetch = FetchType.LAZY)
    private List<CategoriaEntrada> categoriasEntrada;

    // OneToMany con OrdenItems o Ticket si aplica un descuento por ítem
    // (Dependerá de cómo registres el uso de la promoción)
}