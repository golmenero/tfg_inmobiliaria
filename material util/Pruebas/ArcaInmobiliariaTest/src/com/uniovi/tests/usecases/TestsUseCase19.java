package com.uniovi.tests.usecases;

import java.util.List;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase19 {
	// PRUEBA 19. AÑADIR A SEGUIMIENTO
	@Test
	public void Prueba19(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el usuario
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
		// Vamos a la opcion de Propiedades >> Suelos
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/suelo')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Seleccionamos la primera de las propiedades
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/details')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestran los detalles
		PO_View.checkElement(driver, "text", "Detalles de Suelo 1");
		// Pulsamos el boton de Añadir a Seguimiento
		elementos = PO_View.checkElement(driver, "id", "btnAnadirSeguimiento");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que seguimos en la pantalla de detalles y se ha cambiado el boton
		PO_View.checkElement(driver, "text", "Detalles de Suelo 1");
		PO_View.checkElement(driver, "text", "Eliminar de Seguimiento");
		// Comprobamos que nos muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "Añadido a las listas de seguimiento correctamente.");
		// Vamos a ver nuestros seguimientos
		elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "wishes", "h1", "Mis Seguimientos");
		// Comprobamos que estamos en la pantalla correcta
		PO_View.checkElement(driver, "text", "Mis Seguimientos");
		// Comprobamos que nos muestra nuestro seguimiento. Si nos lo muestra significa que se encuentra en la Base de Datos
		PO_View.checkElement(driver, "text", "Suelo 1");
		PO_View.checkElement(driver, "text", "10000");
		PO_View.checkElement(driver, "text", "Alquiler");

	}
	
	@Test
	public void PruebaN19(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el usuario
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
		// Vamos a la opcion de Inicio >> Viviendas
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/vivienda')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Seleccionamos la primera de las propiedades
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/details')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que no se muestra el botón de añadir, sino de eliminar
		PO_View.checkElement(driver, "text", "Eliminar de Seguimiento");
		PO_View.doesNotExist(driver, "text", "Añadir a Mi Seguimiento");
		
	}

}
