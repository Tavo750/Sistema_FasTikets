package pe.edu.pucp.fasticket.model.eventos;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "zona") // Coincide con CREATE TABLE Zona
public class Zona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ATENCIÓN: Mapeamos a 'idCategoria' ya que así está definida en tu SQL para la tabla Zona
    @Column(name = "idCategoria")
    private Integer idZona; // Usamos idZona en Java por claridad

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "aforoMax")
    private Integer aforoMax;

    // Atributos de Auditoría y Control
    @Column(name = "activo")
    private Boolean activo;
    // ... otros campos de auditoría (usuario_creacion, etc.)

    // --- Relaciones ---

    // OneToMany con CategoriaEntrada (Una zona tiene muchas categorías de entradas)
    @OneToMany(mappedBy = "zona", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CategoriaEntrada> categoriasEntrada;
}