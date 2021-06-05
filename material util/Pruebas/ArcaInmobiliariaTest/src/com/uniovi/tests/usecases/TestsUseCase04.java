package com.uniovi.tests.usecases;

import org.bson.Document;
import org.openqa.selenium.WebDriver;

import com.uniovi.tests.pageobjects.PO_AgentRegister;
import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase04 {
	// POSITIVO 1
		public void Prueba04(WebDriver driver, MongoDBUtils mdb) {
			// Comprobamos que no existe el agente en la BD
			mdb.doesNotExist("users", new Document("email", "newagente1@agente.com"));
			
			// Iniciamos sesión con el super agente
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
			// Vamos a la opcion de Agentes
			PO_NavView.clickOption(driver, "agents", "h1", "Gestión de Agentes");
			// Pulsamos en "Agregar nuevo agente"
			PO_NavView.clickOption(driver, "agents/add", "h1", "Creación de Nuevo Agente");
			// Rellenamos el formulario con el nuevo agente
			PO_AgentRegister.fillForm(driver, "newagente1@agente.com", "NewAgente", "NewAgentito", "newAgente");
			// Comprobamos que se muestra el mensaje correcto\
			PO_View.checkElement(driver, "text", "El agente se añadió correctamente.");
			
			// Comprobamos que se ha creado con estado activo = true
			mdb.exists("users", new Document("email", "newagente1@agente.com").append("active", true));
		}

		// NEGATIVO 1. Añadir un agente con correo existente
		public void PruebaN04_1(WebDriver driver, MongoDBUtils mdb) {
			// Comprobamos que ya existe un agente asi
			mdb.exists("users", new Document("email", "agente1@agente.com"));
			// Iniciamos sesión con el super agente
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
			// Vamos a la opcion de Agentes
			PO_NavView.clickOption(driver, "agents", "h1", "Gestión de Agentes");
			// Pulsamos en "Agregar nuevo agente"
			PO_NavView.clickOption(driver, "agents/add", "h1", "Creación de Nuevo Agente");
			// Rellenamos el formulario con el nuevo agente
			PO_AgentRegister.fillForm(driver, "agente1@agente.com", "NewAgente", "NewAgentito", "newAgente");
			// Comprobamos que se muestra el mensaje correcto\
			PO_View.checkElement(driver, "text", "Ya existe un agente con ese correo electrónico.");
		}

		// NEGATIVO 2. Añadir un agente con datos inválidos
		public void PruebaN04_2(WebDriver driver, MongoDBUtils mdb) {
			// Iniciamos sesión con el super agente
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
			// Vamos a la opcion de Agentes
			PO_NavView.clickOption(driver, "agents", "h1", "Gestión de Agentes");
			// Pulsamos en "Agregar nuevo agente"
			PO_NavView.clickOption(driver, "agents/add", "h1", "Creación de Nuevo Agente");
			// Rellenamos el formulario con datos incorrectos
			PO_AgentRegister.fillForm(driver, "a", "NewAgente", "NewAgentito", "newAgente");
			// Comprobamos que seguimos en la pantalla
			PO_View.checkElement(driver, "h1", "Creación de Nuevo Agente");
			// Rellenamos el formulario con datos incorrectos
			PO_AgentRegister.fillForm(driver, "a@a.c", "NewAgente", "NewAgentito", "newAgente");
			// Comprobamos que seguimos en la pantalla
			PO_View.checkElement(driver, "h1", "Creación de Nuevo Agente");
			// Rellenamos el formulario con datos incorrectos
			PO_AgentRegister.fillForm(driver, "newagente@agente.com", "N", "NewAgentito", "newAgente");
			// Comprobamos que seguimos en la pantalla
			PO_View.checkElement(driver, "h1", "Creación de Nuevo Agente");
			// Rellenamos el formulario con datos incorrectos
			PO_AgentRegister.fillForm(driver, "newagente@agente.com", "NewAgente", "N", "newAgente");
			// Comprobamos que seguimos en la pantalla
			PO_View.checkElement(driver, "h1", "Creación de Nuevo Agente");
			// Rellenamos el formulario con datos incorrectos
			PO_AgentRegister.fillForm(driver, "newagente@agente.com", "NewAgente", "NewAgentito", "n");
			// Comprobamos que seguimos en la pantalla
			PO_View.checkElement(driver, "h1", "Creación de Nuevo Agente");
		}


}
