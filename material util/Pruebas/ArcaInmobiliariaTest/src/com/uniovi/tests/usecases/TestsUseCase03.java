package com.uniovi.tests.usecases;

import java.util.List;

import org.bson.Document;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_ModelDeleteProfile;
import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase03 {

	// POSITIVO 1
	public void Prueba03(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el usuario1
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
		// Navegamos hasta la opcion de editar perfil
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "perfilMenu");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "id", "eliminarPerfil");
		elementos.get(0).click();
		// Introducimos la contraseña
		PO_ModelDeleteProfile.fillForm(driver, "adminadmin");
		// Comprobamos que se muestra el mensaje correcto
		PO_View.checkElement(driver, "text", "Usuario eliminado correctamente.");

		// Comprobamos que ya no existe el usuario
		mdb.doesNotExist("users", new Document("email", "usuario1@usuario.com"));
	}

	// NEGATIVO 1. Introducir contraseña incorrecta
	public void PruebaN03_1(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el usuario1
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
		// Navegamos hasta la opcion de editar perfil
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "perfilMenu");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "id", "eliminarPerfil");
		elementos.get(0).click();
		// Introducimos la contraseña
		PO_ModelDeleteProfile.fillForm(driver, "contraseñaEquivocada");
		// Comprobamos que se muestra el mensaje correcto
		PO_View.checkElement(driver, "text", "Contraseña incorrecta.");

		// Comprobamos queno se ha eliminado el usuario
		mdb.exists("users", new Document("email", "usuario1@usuario.com"));
	}

	// NEGATIVO 2. Eliminar Perfil de Super-Agente
	public void PruebaN03_2(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el usuario1
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Navegamos hasta la opcion de editar perfil
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "perfilMenu");
		elementos.get(0).click();
		// Comprobamos que no aparece la opcion de Eliminar Perfil
		PO_View.doesNotExist(driver, "text", "Eliminar Perfil");
	}

}
