package pe.edu.pucp.fasticket.model.auditoria;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.usuario.Administrador;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "auditoria_admin") // Coincide con CREATE TABLE auditoria_admin
public class AuditoriaAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria") // Coincide con id_auditoria
    private Integer idAuditoria;

    // Mapeo de ENUM tipo_accion
    @Enumerated(EnumType.STRING)
    @Column(name = "accion", nullable = false)
    private String accion;

    @Column(name = "modulo")
    private String modulo;

    @Column(name = "fecha", columnDefinition = "TIMESTAMP")
    private LocalDateTime fecha;

    @Column(name = "ip_origen")
    private String ipOrigen;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "navegador")
    private String navegador;

    @Column(name = "sistema_operativo")
    private String sistemaOperativo;

    @Column(name = "activo")
    private Boolean activo;

    // Relación ManyToOne con Administrador (FK 'usuario' apunta a Administrador)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario", nullable = false) // Coincide con usuario INT NOT NULL (FK)
    private Administrador administrador;
}