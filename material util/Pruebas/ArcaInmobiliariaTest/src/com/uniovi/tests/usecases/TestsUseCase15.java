package com.uniovi.tests.usecases;

import java.util.List;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase15 {
	// PRUEBA 15. VER PROPIEDADES PUBLICADA
		@Test
		public void Prueba15(WebDriver driver, MongoDBUtils mdb) {
			// Iniciamos sesión con el super agente
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
			// Vamos a la opcion de Mis Propiedades
			List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
			elementos.get(0).click();
			PO_NavView.clickOption(driver, "myproperties", "h1", "Inmuebles Publicados");

			// Comprobamos que se muestran los datos de las propiedades correctamente
			PO_View.checkElement(driver, "text", "VP01");
			PO_View.checkElement(driver, "text", "Vivienda 1");
			PO_View.checkElement(driver, "text", "vivienda");
			PO_View.checkElement(driver, "text", "1000");

			PO_View.checkElement(driver, "text", "LP01");
			PO_View.checkElement(driver, "text", "Local 1");
			PO_View.checkElement(driver, "text", "local");
			PO_View.checkElement(driver, "text", "1000");

			PO_View.checkElement(driver, "text", "SP01");
			PO_View.checkElement(driver, "text", "Suelo 1");
			PO_View.checkElement(driver, "text", "suelo");
			PO_View.checkElement(driver, "text", "1000");
		}
}
