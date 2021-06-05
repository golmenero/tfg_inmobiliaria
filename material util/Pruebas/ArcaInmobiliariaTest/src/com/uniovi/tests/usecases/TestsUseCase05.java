package com.uniovi.tests.usecases;

import java.util.List;

import org.bson.Document;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_AgentEdit;
import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase05 {
	// POSITIVO
	public void Prueba05(WebDriver driver, MongoDBUtils mdb) {
		// Comprobamos que no existe el usuario editado
		mdb.doesNotExist("users", new Document("name", "NewAgente").append("surname", "NewAgentito"));

		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Agentes
		PO_NavView.clickOption(driver, "agents", "h1", "Gestión de Agentes");
		// Pulsamos en el boton de Editar junto al agente de nombre "Agente1"
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/agents/edit')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Rellenamos el formulario con el nuevo agente
		PO_AgentEdit.fillForm(driver, "NewAgente", "NewAgentito", "newAgente1@agente.com", "newAgente");
		// Comprobamos que se muestra el mensaje correcto\
		PO_View.checkElement(driver, "text", "El agente se editó correctamente.");

		// Comprobamos que no existe el usuario antiguo, pero si el editado
		mdb.exists("users", new Document("name", "NewAgente").append("surname", "NewAgentito"));
		mdb.doesNotExist("users", new Document("name", "Agente1").append("surname", "Agentito1"));
	}

	// NEGATIVO 1. Editar el agente con correo existente
	public void PruebaN05_1(WebDriver driver, MongoDBUtils mdb) {
		// Comprobamos que ya existe un agente con ese email
		mdb.exists("users", new Document("email", "agente2@agente.com"));

		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Agentes
		PO_NavView.clickOption(driver, "agents", "h1", "Gestión de Agentes");
		// Pulsamos en el boton de Editar junto al agente de nombre "Agente1"
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/agents/edit')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Rellenamos el formulario con el correo electronico de un agente existente
		PO_AgentEdit.fillForm(driver, "NewAgente", "NewAgentito", "agente2@agente.com", "newAgente");
		// Comprobamos que se muestra el mensaje correcto
		PO_View.checkElement(driver, "text", "Ya existe un agente con ese correo electrónico.");

		// Comprobamos que no se ha modificado el agente
		mdb.doesNotExist("users", new Document("name", "NewAgente").append("surname", "NewAgentito"));
		mdb.exists("users", new Document("name", "Agente2").append("surname", "Agentito2"));
	}

	// NEGATIVO 2. Introducir datos inválidos
	public void PruebaN05_2(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Agentes
		PO_NavView.clickOption(driver, "agents", "h1", "Gestión de Agentes");
		// Pulsamos en el boton de Editar junto al agente de nombre "Agente1"
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/agents/edit')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Rellenamos el formulario con datos invalidos
		PO_AgentEdit.fillForm(driver, "NewAgente", "NewAgentito", "a", "newAgente");
		// Comprobamos que seguimos en la pantalla de edicion
		PO_View.checkElement(driver, "h1", "Edición de Agente Existente");
		// Rellenamos el formulario con datos invalidos
		PO_AgentEdit.fillForm(driver, "NewAgente", "NewAgentito", "a@a.c", "newAgente");
		// Comprobamos que seguimos en la pantalla de edicion
		PO_View.checkElement(driver, "h1", "Edición de Agente Existente");
		// Rellenamos el formulario con datos invalidos
		PO_AgentEdit.fillForm(driver, "N", "NewAgentito", "newagente@agente.com", "newAgente");
		// Comprobamos que seguimos en la pantalla de edicion
		PO_View.checkElement(driver, "h1", "Edición de Agente Existente");
		// Rellenamos el formulario con datos invalidos
		PO_AgentEdit.fillForm(driver, "NewAgente", "N", "newagente@agente.com", "newAgente");
		// Comprobamos que seguimos en la pantalla de edicion
		PO_View.checkElement(driver, "h1", "Edición de Agente Existente");
		// Rellenamos el formulario con datos invalidos
		PO_AgentEdit.fillForm(driver, "NewAgente", "NewAgentito", "newagente@agente.com", "n");
		// Comprobamos que seguimos en la pantalla de edicion
		PO_View.checkElement(driver, "h1", "Edición de Agente Existente");

	}
}
