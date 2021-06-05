package com.uniovi.tests.usecases;

import java.util.List;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_PropertyFilter;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase14 {
	// PRUEBA 14.1. FILTRAR PROPIEDADES - VIVIENDA
		@Test
		public void Prueba14_1(WebDriver driver, MongoDBUtils mdb) {
			// Iniciamos sesión con el super agente
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
			// Vamos a la opcion de Propiedades >> Viviendas
			List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
			elementos.get(0).click();
			elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/vivienda')]");
			elementos.get(0).click();
			PO_View.esperaPantallaDeCarga(driver);
			// Abrimos el filtro
			elementos = PO_View.checkElement(driver, "id", "btnExpandFilter");
			elementos.get(0).click();
			// Rellenamos el filtro
			PO_PropertyFilter.fillFormVivienda(driver, "Alquiler", "2", "2", "3",
					"5", "2", "110", "90", "3", "2", "1590", "1610", false, true,
					false, true, false, true, false, true, false, true);
			// Comprobamos que ahora solo aparece la vivienda 2
			PO_View.checkElement(driver, "text", "Vivienda 2");
			PO_View.doesNotExist(driver, "text", "Vivienda 1");
		}
		
		
		// PRUEBA 14.2. FILTRAR PROPIEDADES - LOCAL
		@Test
		public void Prueba14_2(WebDriver driver, MongoDBUtils mdb) {
			// Iniciamos sesión con el super agente
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
			// Vamos a la opcion de Propiedades >> Locales
			List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
			elementos.get(0).click();
			elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/local')]");
			elementos.get(0).click();
			PO_View.esperaPantallaDeCarga(driver);
			// Abrimos el filtro
			elementos = PO_View.checkElement(driver, "id", "btnExpandFilter");
			elementos.get(0).click();
			// Rellenamos el filtro
			PO_PropertyFilter.fillFormLocal(driver, "Alquiler", "2", "2", "2", "540", "560", "3", "5",
					"1", "1190","1210", false, true, false, true, false, true, false);
			// Comprobamos que ahora solo aparece el local 2
			PO_View.checkElement(driver, "text", "Local 2");
			PO_View.doesNotExist(driver, "text", "Local 1");
		}
		
		// PRUEBA 14.3. FILTRAR PROPIEDADES - SUELO
		@Test
		public void Prueba14_3(WebDriver driver, MongoDBUtils mdb) {
			// Iniciamos sesión con el super agente
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
			// Vamos a la opcion de Propiedades >> Suelos
			List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
			elementos.get(0).click();
			elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/suelo')]");
			elementos.get(0).click();
			PO_View.esperaPantallaDeCarga(driver);
			// Abrimos el filtro
			elementos = PO_View.checkElement(driver, "id", "btnExpandFilter");
			elementos.get(0).click();
			// Rellenamos el filtro
			PO_PropertyFilter.fillFormSuelo(driver, "Venta", "2", "2", "2", "14990",
					"15010", "710", "690", "290", "310", false, true);
			// Comprobamos que ahora solo aparece el suelo 2
			PO_View.checkElement(driver, "text", "Suelo 2");
			PO_View.doesNotExist(driver, "text", "Suelo 1");
		}
}
