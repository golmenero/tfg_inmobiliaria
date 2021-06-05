package com.uniovi.tests.usecases;


import org.junit.Test;
import org.openqa.selenium.WebDriver;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase22 {
	// PRUEBA 22. VER INFORMACION DE CONTACTO
		@Test
		public void Prueba22(WebDriver driver, MongoDBUtils mdb) {
			PO_NavView.clickOption(driver, "info/contact", "h1", "Información de Contacto");
			// Comprobamos que se muestra la informacion de contacto
			PO_View.checkElement(driver, "text", "985 470 012, 666 666 666");
			PO_View.checkElement(driver, "text", "info@arca-agenciainmobiliaria.com, arca@agenciainmobiliaria.com");
			
		}
}
