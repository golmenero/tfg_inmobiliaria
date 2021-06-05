package com.uniovi.tests.usecases;


import org.openqa.selenium.WebDriver;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase08 {
	// POSITIVO
	public void Prueba08(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "h1", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Estadísticas
		PO_NavView.clickOption(driver, "info/statistics", "h1", "Estadísticas");
	}
}
