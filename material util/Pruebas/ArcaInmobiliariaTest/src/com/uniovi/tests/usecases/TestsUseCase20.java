package com.uniovi.tests.usecases;

import java.util.List;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase20 {
	// PRUEBA 20. ELIMINAR DE SEGUIMIENTOS
	@Test
	public void Prueba20(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el usuario
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
		// Vamos a la opcion de Propiedades Guardadas
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "wishes", "h1", "Mis Seguimientos");
		// Comprobamos que se muestra el seguimiento
		PO_View.checkElement(driver, "text", "Vivienda 1");
		PO_View.checkElement(driver, "text", "Venta");
		PO_View.checkElement(driver, "text", "1000");
		// Seleccionamos la opcion de eliminar, junto al seguimiento
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/wishes/delete')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "Eliminado de las listas de seguimiento correctamente.");
		// Vamos a ver nuestros seguimientos
		elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "wishes", "h1", "Mis Seguimientos");
		// Comprobamos que estamos en la pantalla correcta
		PO_View.checkElement(driver, "text", "Mis Seguimientos");
		// Comprobamos que ya no se muestra el seguimiento
		PO_View.doesNotExist(driver, "text", "Vivienda 1");
		PO_View.doesNotExist(driver, "text", "Venta");
	}

}
