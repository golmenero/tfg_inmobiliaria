package com.uniovi.tests.usecases;


import org.junit.Test;
import org.openqa.selenium.WebDriver;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase16 {
	// PRUEBA 16. VER CONVERSACIONES
		@Test
		public void Prueba16(WebDriver driver, MongoDBUtils mdb) {
			// Iniciamos sesión con el usuario
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
			// Vamos a la opcion de Mensajes
			PO_NavView.clickOption(driver, "conversations", "h1", "Conversaciones Activas");
			// Comprobamos que se muestra la información correcta
			PO_View.checkElement(driver, "text", "Vivienda 1");
			PO_View.checkElement(driver, "text", "vivienda");
			PO_View.checkElement(driver, "text", "1000");
		}
}
