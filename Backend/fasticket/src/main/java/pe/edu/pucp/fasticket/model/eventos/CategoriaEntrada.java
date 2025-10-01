package pe.edu.pucp.fasticket.model.eventos;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.compra.ItemCarrito;
import pe.edu.pucp.fasticket.model.fidelizacion.Promocion;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "categoria_entrada") // AJUSTAR: Nombre de tu tabla en PostgreSQL
public class CategoriaEntrada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria_entrada") // AJUSTAR: Nombre de tu PK
    private Integer idCategoriaEntrada;

    // --- Atributos de Identificación y Precio ---

    @Column(name = "nombre", nullable = false)
    private String nombre; // Ej: VIP, General, Palco

    @Column(name = "precio_base", nullable = false)
    private Double precioBase;

    // --- Atributos de Cupo y Venta ---

    @Column(name = "cupos_totales", nullable = false)
    private Integer cuposTotales;

    @Column(name = "cupos_disponibles", nullable = false)
    private Integer cuposDisponibles; // Cupos restantes (se actualiza al vender/reservar)

    @Column(name = "fecha_venta_inicio")
    private LocalDateTime fechaVentaInicio;

    @Column(name = "fecha_venta_fin")
    private LocalDateTime fechaVentaFin;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    // --- Relaciones ---

    // ManyToOne con Evento (Muchos tipos de entrada pertenecen a un Evento)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evento", nullable = false) // AJUSTAR: Nombre de la FK a la tabla Evento
    private Evento evento;

    // ManyToOne con Zona (Una categoría de entrada está asociada a una zona del local)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_zona", nullable = false) // AJUSTAR: Nombre de la FK a la tabla Zona
    private Zona zona;

    // OneToMany con Ticket (Una categoría puede generar muchos tickets individuales)
    @OneToMany(mappedBy = "categoriaEntrada", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ticket> tickets;

    // OneToMany con ItemCarrito (Relación inversa con la clase que acabamos de crear)
    @OneToMany(mappedBy = "categoriaEntrada", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ItemCarrito> itemsCarrito;

    // ManyToMany con Promocion (Una entrada puede tener varias promociones aplicables)
    // Para simplificar, asumiremos una tabla de unión (ej: categoria_promocion)
    // Usaremos un mapeo básico ManyToMany, que necesitará la clase Promocion
    @ManyToMany
    @JoinTable(
            name = "categoria_promocion", // AJUSTAR: Nombre de la tabla de unión
            joinColumns = @JoinColumn(name = "id_categoria_entrada"),
            inverseJoinColumns = @JoinColumn(name = "id_promocion") // Necesita la clase Promocion
    )
    private List<Promocion> promocionesAplicables;
}