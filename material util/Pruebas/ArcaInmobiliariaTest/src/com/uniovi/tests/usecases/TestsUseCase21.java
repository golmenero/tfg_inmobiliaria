package com.uniovi.tests.usecases;

import org.junit.Test;
import org.openqa.selenium.WebDriver;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase21 {
	// PRUEBA 21. VER SEGUIMIENTOS
		@Test
		public void Prueba21(WebDriver driver, MongoDBUtils mdb) {
			// Iniciamos sesión con el usuario
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
			// Vamos a la opcion de Propiedades Guardadas
			PO_NavView.clickOption(driver, "/wishes", "h1", "Mis Seguimientos");
			// Comprobamos que se muestra el seguimiento
			PO_View.checkElement(driver, "text", "Vivienda 1");
			PO_View.checkElement(driver, "text", "Venta");
			PO_View.checkElement(driver, "text", "1000");
		}
}
