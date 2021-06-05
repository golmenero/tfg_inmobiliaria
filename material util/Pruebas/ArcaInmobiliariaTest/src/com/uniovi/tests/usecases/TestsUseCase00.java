package com.uniovi.tests.usecases;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;


public class TestsUseCase00 {

	public void Prueba00(WebDriver driver, MongoDBUtils mdb) {
		// Comprobamos que antes de iniciar sesion aparece la opcion de inicio y
		// registro
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/login')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/signin')]");

		// ### USUARIO ###
		// Iniciamos sesión con el usuario1
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
		// Comprobamo que se muestran las opciones correctas en la barra de navegacion
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
		elementos.get(0).click();
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/vivienda')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/local')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/suelo')]");

		elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_View.doesNotExist(driver, "text", "Añadir Propiedad");
		PO_View.doesNotExist(driver, "text", "Mis Propiedades");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/wishes')]");

		PO_View.doesNotExist(driver, "id", "navAgentes");
		PO_View.doesNotExist(driver, "text", "Estadísticas");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/conversations')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/info/contact')]");

		elementos = PO_View.checkElement(driver, "id", "perfilMenu");
		elementos.get(0).click();
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/users/edit')]");
		PO_View.checkElement(driver, "id", "eliminarPerfil");

		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/disconnect')]");
		// Cerramos sesion
		elementos.get(0).click();

		// Comprobamos que vuelven a aparecer las opciones de inicio y registro
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/login')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/signin')]");

		// ### AGENTE ###
		// Iniciamos sesión con el agente1
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "agente1@agente.com", "adminadmin");
		// Comprobamo que se muestran las opciones correctas en la barra de navegacion
		elementos = PO_View.checkElement(driver, "id", "inicioMenu");
		elementos.get(0).click();
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/vivienda')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/local')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/suelo')]");

		elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/add')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/myproperties')]");
		PO_View.doesNotExist(driver, "id", "navPropiedadesGuardadas");

		PO_View.doesNotExist(driver, "id", "navAgentes");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/info/statistics')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/conversations')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/info/contact')]");

		elementos = PO_View.checkElement(driver, "id", "perfilMenu");
		elementos.get(0).click();
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/users/edit')]");
		PO_View.checkElement(driver, "id", "eliminarPerfil");

		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/disconnect')]");
		// Cerramos sesion
		elementos.get(0).click();

		// ### SUPERAGENTE ###
		// Iniciamos sesión con el superagente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Comprobamo que se muestran las opciones correctas en la barra de navegacion
		elementos = PO_View.checkElement(driver, "id", "inicioMenu");
		elementos.get(0).click();
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/vivienda')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/local')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/suelo')]");

		elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/add')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/myproperties')]");
		PO_View.doesNotExist(driver, "text", "Propiedades Guardadas");

		PO_View.checkElement(driver, "free", "//a[contains(@href, '/agents')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/info/statistics')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/conversations')]");
		PO_View.checkElement(driver, "free", "//a[contains(@href, '/info/contact')]");

		elementos = PO_View.checkElement(driver, "id", "perfilMenu");
		elementos.get(0).click();
		PO_View.doesNotExist(driver, "text", "Eliminar Perfil");

		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/disconnect')]");
		// Cerramos sesion
		elementos.get(0).click();
	}

}
