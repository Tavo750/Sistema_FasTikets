package pe.edu.pucp.fasticket.dto.eventos;

import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.pucp.fasticket.model.eventos.Local;

@Data
@NoArgsConstructor
public class LocalDTO {
    private Integer idLocal, aforoTotal, codigoPostal;
    private String nombre, direccion, departamento;
    private Boolean activo;

    public LocalDTO(Local p_local){
        this.idLocal = p_local.getIdLocal();
        this.aforoTotal = p_local.getAforoTotal();
        this.codigoPostal = p_local.getCodigoPostal();
        this.nombre = p_local.getNombre();
        this.direccion = p_local.getDireccion();
        this.departamento = p_local.getDepartamento();
        this.activo = p_local.getActivo();
    }
}
