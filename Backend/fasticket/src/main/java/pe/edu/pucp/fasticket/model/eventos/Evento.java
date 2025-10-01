package pe.edu.pucp.fasticket.model.eventos;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "evento") // Coincide con CREATE TABLE Evento
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEvento") // Coincide con idEvento SERIAL PRIMARY KEY
    private Integer idEvento;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fecha")
    private LocalDate fecha; // Coincide con fecha DATE

    @Column(name = "hora")
    private LocalTime hora; // Coincide con hora TIME

    @Lob // Para manejar datos binarios grandes como imágenes (BYTEA)
    @Column(name = "url_imagen")
    private byte[] urlImagen;

    // Atributos de Auditoría y Control
    @Column(name = "activo")
    private Boolean activo;
    @Column(name = "usuario_creacion")
    private Integer usuarioCreacion;
    // ... otros campos de auditoría (fecha_creacion, etc. heredados de Persona)

    // Mapeo de ENUM EstadoEvento y TipoEvento
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoEvento estado; // Coincide con estado EstadoEvento

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoEvento tipo; // Coincide con tipo TipoEvento

    // --- Relaciones ---

    // ManyToOne con Local (Un evento se realiza en un local) (RF-008)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idLocal", nullable = false) // Coincide con fk_local
    private Local local;

    // OneToMany con Ticket (Un evento tiene muchos tickets)
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ticket> tickets;

    // OneToMany con CategoriaEntrada (Muchas categorías de entrada)
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CategoriaEntrada> categoriasEntrada; // Nota: Usaremos CategoriaEntrada en lugar de Ticket para las categorías.
}