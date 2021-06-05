package com.uniovi.tests.usecases;

import org.bson.Document;
import org.openqa.selenium.WebDriver;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserRegister;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase01 {


	// POSITIVO 1
	public void Prueba01(WebDriver driver, MongoDBUtils mdb) {
		// Comprobamos que no existe el usuario en la BD
		mdb.doesNotExist("users", new Document("email", "prueba1@prueba.es"));
		
		// Vamos al formulario de registro
		PO_NavView.clickOption(driver, "signin", "text", "Registrar Usuario");
		// Rellenamos el formulario.
		PO_UserRegister.fillForm(driver, "prueba1@prueba.es", "Prueba", "Pruebita", "pruebapruebita");
		// Comprobamos que nos deja en la pantalla de login
		PO_View.checkElement(driver, "h1", "Identificación de usuario");
		// Comprobamos que nos muestra el mensaje de
		// "Se ha enviado un mensaje a su bandeja de entrada. Revísela para activar su
		// perfil."
		PO_View.checkElement(driver, "text",
				"Se ha enviado un mensaje a su bandeja de entrada. Revísela para activar su perfil.");
		
		// Comprobamos que se ha creado con estado activo = false
		mdb.exists("users", new Document("email", "prueba1@prueba.es").append("active", false));
	}

	// NEGATIVO 1. Correo ya existente
	public void PruebaN01_1(WebDriver driver, MongoDBUtils mdb) {
		// Comprobamos que ya existe un usuario asi
		mdb.exists("users", new Document("email", "usuario1@usuario.com"));
		
		// Vamos al formulario de registro
		PO_NavView.clickOption(driver, "signin", "text", "Registrar Usuario");
		// Rellenamos el formulario.
		PO_UserRegister.fillForm(driver, "usuario1@usuario.com", "Prueba", "Pruebita", "pruebapruebita");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text",
				"Este correo electrónico ya pertenece a una cuenta. Utilice uno diferente.");
	}

	// NEGATIVO 2. Datos incorrectos
	public void PruebaN01_2(WebDriver driver, MongoDBUtils mdb) {
		// Vamos al formulario de registro
		PO_NavView.clickOption(driver, "signin", "text", "Registrar Usuario");
		// Rellenamos el formulario y pulsamos el boton.
		PO_UserRegister.fillForm(driver, "prueba2prueba.com", "Prueba", "Pruebita", "pruebapruebita");
		// Comprobamos que seguimos en la página de registro (no es posible comprobar la
		// existancia del mensaje especifico de tamaño,
		// ya que es generado por el navegador, no por la hoja HTML.
		PO_View.checkElement(driver, "text", "Registrar Usuario");
		PO_UserRegister.fillForm(driver, "p@a.com", "Prueba", "Pruebita", "pruebapruebita");
		PO_View.checkElement(driver, "text", "Registrar Usuario");
		PO_UserRegister.fillForm(driver, "prueba2@prueba.com", "P", "Pruebita", "pruebapruebita");
		PO_View.checkElement(driver, "text", "Registrar Usuario");
		PO_UserRegister.fillForm(driver, "prueba2@prueba.com", "Prueba", "P", "pruebapruebita");
		PO_View.checkElement(driver, "text", "Registrar Usuario");
		PO_UserRegister.fillForm(driver, "prueba2@prueba.com", "Prueba", "Pruebita", "pr");
		PO_View.checkElement(driver, "text", "Registrar Usuario");
	}
}
