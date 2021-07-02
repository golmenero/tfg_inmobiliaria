package com.uniovi.tests.usecases;

import org.bson.Document;
import org.openqa.selenium.WebDriver;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase07 {
	// POSITIVO
		public void Prueba07(WebDriver driver, MongoDBUtils mdb) {
			// Comprobamos que existe el usuario
			mdb.exists("users", new Document("email", "usuario1@usuario.com"));
			
			// Vamos al formulario de inicio de sesión
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			// Rellenamos el formulario.
			PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
			// Comprobamos que nos deja en la pantalla de inicio
			PO_View.checkElement(driver, "text", "¿Qué estás buscando?");
			// Comprobamos que nos muestra el mensaje de
			// "Ha iniciado sesión correctamente."
			PO_View.checkElement(driver, "text", "Ha iniciado sesión correctamente.");
		}

		// NEGATIVO 1. Introducir datos inválidos
		public void PruebaN07_1(WebDriver driver, MongoDBUtils mdb) {
			// Comprobamos que no existe el usuario
			mdb.doesNotExist("users", new Document("email", "newusuario@usuario.com"));
			
			// Vamos al formulario de inicio de sesión
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			// Rellenamos el formulario.
			PO_UserLogin.fillForm(driver, "newusuario@usuario.com", "adminadmin");
			// Comprobamos que no nos saca de la pantalla de Login
			PO_View.checkElement(driver, "text", "Identificación de usuario");
			// Comprobamos que nos muestra el mensaje correcto
			PO_View.checkElement(driver, "text", "Usuario y/o contraseña incorrectos");
		}

		// NEGATIVO 2. Inicio en sesión con correo sin verificar
		public void PruebaN07_2(WebDriver driver, MongoDBUtils mdb) {
			// Comprobamos que el usuario se encuentra sin verificar
			mdb.exists("users", new Document("email", "usuario2@usuario.com").append("active", false));
			
			// Vamos al formulario de inicio de sesión
			PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
			// Rellenamos el formulario.
			PO_UserLogin.fillForm(driver, "usuario2@usuario.com", "adminadmin");
			// Comprobamos que no nos saca de la pantalla de Login
			PO_View.checkElement(driver, "text", "Identificación de usuario");
			// Comprobamos que nos muestra el mensaje correcto
			PO_View.checkElement(driver, "text", "Su correo no ha sido verificado. Revise su bandeja de entrada.");
		}

}
