package pe.edu.pucp.fasticket.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.pucp.fasticket.model.Persona;
import pe.edu.pucp.fasticket.services.PersonaServicio;

import java.util.List;

@RestController
@RequestMapping("/api/personas")
public class PersonaController {

    @Autowired
    private PersonaServicio serv_persona;

    @GetMapping
    public ResponseEntity<List<Persona>> listarTodos(){
        List<Persona> personas = serv_persona.ListarPersonas();
        return new ResponseEntity<>(personas, HttpStatus.OK);
    }
}
