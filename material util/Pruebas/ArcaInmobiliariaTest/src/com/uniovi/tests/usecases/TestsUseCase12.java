package com.uniovi.tests.usecases;

import java.util.List;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase12 {

	// PRUEBA 12. VER PROPIEDADES - VIVIENDA
	@Test
	public void Prueba12_1(WebDriver driver, MongoDBUtils mdb) {
		// Vamos directamente a la pantalla Propiedades >> Viviendas
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Propiedades >> Viviendas
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/vivienda')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestran las propiedades correctas
		 PO_View.checkElement(driver, "text", "Vivienda 1");
		 PO_View.checkElement(driver, "text", "Vivienda 2");
		
	}

	// PRUEBA 12. VER PROPIEDADES - LOCAL
	@Test
	public void Prueba12_2(WebDriver driver, MongoDBUtils mdb) {
		// Vamos directamente a la pantalla Propiedades >> Locales
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Propiedades >> Locales
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/local')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestran las propiedades correctas
		 PO_View.checkElement(driver, "text", "Local 1");
		 PO_View.checkElement(driver, "text", "Local 2");
	}

	// PRUEBA 12. VER PROPIEDADES - SUELO
	@Test
	public void Prueba12_3(WebDriver driver, MongoDBUtils mdb) {
		// Vamos directamente a la pantalla Propiedades >> Suelos
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Propiedades >> Locales
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/suelo')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestran las propiedades correctas
		 PO_View.checkElement(driver, "text", "Suelo 1");
		 PO_View.checkElement(driver, "text", "Suelo 2");
	}

}
