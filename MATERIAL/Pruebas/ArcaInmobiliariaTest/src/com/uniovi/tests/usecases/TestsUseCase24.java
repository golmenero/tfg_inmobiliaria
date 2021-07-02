package com.uniovi.tests.usecases;


import org.junit.Test;
import org.openqa.selenium.WebDriver;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase24 {
	// PRUEBA 22. EDITAR INFORMACION DE CONTACTO
	@Test
	public void Prueba24(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		// Vamos a la seccion de Ayuda
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la seccion de Ayuda
		PO_NavView.clickOption(driver, "info/help", "text", "Ayuda sobre el Sistema");
		// Comprobamos que muestra la pantalla
		PO_View.checkElement(driver, "text", "Ayuda sobre el Sistema");
	}
}
