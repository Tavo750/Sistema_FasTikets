package pe.edu.pucp.fasticket.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.pucp.fasticket.model.Persona;
import pe.edu.pucp.fasticket.repository.PersonasRepositorio;

import java.util.List;
import java.util.Optional;

@Service
public class PersonaServicio {
    @Autowired
    private PersonasRepositorio repo_personas;

    public List<Persona> ListarPersonas(){
        return repo_personas.findAll();
    }

    public Optional<Persona> BuscarId(Integer id){
        return repo_personas.findById(id);
    }

    public Persona Guardar(Persona persona){
        return (Persona) repo_personas.save(persona);
    }

    public void Eliminar(Integer id){
        repo_personas.deleteById(id);
    }
}
