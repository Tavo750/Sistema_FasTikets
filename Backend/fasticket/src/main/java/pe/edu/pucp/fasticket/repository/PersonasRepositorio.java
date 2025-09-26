package pe.edu.pucp.fasticket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.pucp.fasticket.model.Persona;

@Repository
public interface PersonasRepositorio extends JpaRepository<Persona, Integer> {

}
