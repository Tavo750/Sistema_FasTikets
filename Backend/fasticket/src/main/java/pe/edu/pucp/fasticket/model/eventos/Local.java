package pe.edu.pucp.fasticket.model.eventos;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.geografia.Distrito;

import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "local") // Coincide con CREATE TABLE Local
public class Local {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idLocal") // Coincide con idLocal SERIAL PRIMARY KEY
    private Integer idLocal;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "aforoTotal")
    private Integer aforoTotal;

    @Column(name = "departamento")
    private String departamento; // En tu SQL es VARCHAR(255)

    @Column(name = "codigoPostal")
    private Integer codigoPostal;

    // Atributos de Auditoría y Control
    @Column(name = "activo")
    private Boolean activo;
    // ... otros campos de auditoría

    // --- Relaciones ---

    // ManyToOne con Distrito (Un local está en un distrito)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDistrito") // Coincide con fk_dist_local
    private Distrito distrito;

    // OneToMany con Evento (Un local alberga muchos eventos)
    @OneToMany(mappedBy = "local", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Evento> eventos;

    // Relación INUSUAL según el script SQL:
    // Tu SQL define una FK (idCategoria) de Local a Zona.
    // Lo más lógico es una lista de zonas. Si solo es una, úsala así:
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCategoria") // Mapea a la FK idCategoria de tu tabla Local
    private Zona zonaPrincipal; // Usamos un nombre de variable para reflejar la relación

    // NOTA: Si un local tiene MUCHAS zonas, la relación correcta sería OneToMany desde Local a Zona.
    // Como tu SQL pone la FK en Local, mantendremos esta relación ManyToOne.
}