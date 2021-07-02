package com.uniovi.tests.usecases;

import java.util.List;

import org.bson.Document;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_ContactEdit;
import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase23 {
	// PRUEBA 22. EDITAR INFORMACION DE CONTACTO
	@Test
	public void Prueba23(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la seccion de Contacto
		PO_NavView.clickOption(driver, "info/contact", "h1", "Información de Contacto");
		// Pulsamos el boton de Editar Info de Contacto
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "btnEditarContacto");
		elementos.get(0).click();
		// Rellenamos los campos con los nuevos datos
		PO_ContactEdit.fillForm(driver, "999 999 999, 677 777 777", "contactoderprueba@prueba.com");
		// Comprobamos que se muestra la nueva informacion de contacto
		PO_View.checkElement(driver, "text", "999 999 999, 677 777 777");
		PO_View.checkElement(driver, "text", "contactoderprueba@prueba.com");
		
		// Comprobamos que se encuentra en la Base de Datos
		mdb.exists("info", new Document("phones", "999 999 999, 677 777 777").append("emails", "contactoderprueba@prueba.com"));
	}
}
