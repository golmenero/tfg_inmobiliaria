package com.uniovi.tests.usecases;

import java.util.List;

import org.bson.Document;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase06 {
	// POSITIVO
	public void Prueba06(WebDriver driver, MongoDBUtils mdb) {
		// Comprobamos que existe el agente a elimimar
		mdb.exists("users", new Document("name", "Agente1").append("surname", "Agentito1"));

		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "h1", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Agentes
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "/agents", "h1", "Gestión de Agentes");
		// Pulsamos en el boton de Editar junto al agente de nombre "Agente1"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/agents/delete')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestra el mensaje correcto
		PO_View.checkElement(driver, "text", "Agente eliminado correctamente.");

		// Comprobamos que ya no existe el agente
		mdb.doesNotExist("users", new Document("name", "Agente1").append("surname", "Agentito1"));

	}

}
