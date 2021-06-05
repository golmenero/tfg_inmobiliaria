package com.uniovi.tests.usecases;

import java.util.List;

import org.bson.Document;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserEdit;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase02  {


	// POSITIVO 1
	public void Prueba02(WebDriver driver, MongoDBUtils mdb) {
		// Comprobamos que no existe el usuario editado  
		mdb.doesNotExist("users", new Document("name", "NewUsuario1").append("surname", "NewUsuarito1"));
		
		// Iniciamos sesión con el usuario1
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
		// Navegamos hasta la opcion de eliminar perfil
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "perfilMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "users/edit", "h1", "Editar Perfil");
		// Rellenamos los campos con los nuevos datos
		PO_UserEdit.fillForm(driver, "NewUsuario1", "NewUsuarito1", "adminadmin", "newadminadmin");
		// Comprobamos que se muestra el mensaje correcto
		PO_View.checkElement(driver, "text", "Su perfil se ha modificado correctamente.");
		
		// Comprobamos que no existe el usuario antiguo, pero si el editado 
		mdb.exists("users", new Document("name", "NewUsuario1").append("surname", "NewUsuarito1"));
		mdb.doesNotExist("users", new Document("name", "Usuario1").append("surname", "Usuarito1"));
	}

	// NEGATIVO 1. Introducir contraseña antigua inválida
	public void PruebaN02_1(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el usuario1
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
		// Navegamos hasta la opcion de eliminar perfil
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "perfilMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "users/edit", "h1", "Editar Perfil");
		// Rellenamos los campos con los nuevos datos
		PO_UserEdit.fillForm(driver, "NewUsuario", "NewUsuarito1", "contrasenaEquivocada", "newadminadmin");
		// Comprobamos que seguimos en la misma página y se muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Contraseña Incorrecta. Inténtelo de nuevo.");
		PO_View.checkElement(driver, "h1", "Editar Perfil");
		
		// Comprobamos que no se han modificado los datos
		mdb.doesNotExist("users", new Document("name", "NewUsuario1").append("surname", "NewUsuarito1"));
		mdb.exists("users", new Document("name", "Usuario1").append("surname", "Usuarito1"));
	}

	// NEGATIVO 2. Introducir datos inválidos
	public void PruebaN02_2(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el usuario1
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
		// Navegamos hasta la opcion de eliminar perfil
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "perfilMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "users/edit", "h1", "Editar Perfil");
		// Rellenamos los campos con los nuevos datos
		PO_UserEdit.fillForm(driver, "N", "NewUsuarito1", "adminadmin", "newadminadmin");
		// Comprobamos que seguimos en la misma página
		PO_View.checkElement(driver, "h1", "Editar Perfil");
		// Rellenamos los campos con los nuevos datos
		PO_UserEdit.fillForm(driver, "NewUsuario", "N", "adminadmin", "newadminadmin");
		// Comprobamos que seguimos en la misma página
		PO_View.checkElement(driver, "h1", "Editar Perfil");
		// Rellenamos los campos con los nuevos datos
		PO_UserEdit.fillForm(driver, "NewUsuario", "NewUsuarito1", "adminadmin", "n");
		// Comprobamos que seguimos en la misma página
		PO_View.checkElement(driver, "h1", "Editar Perfil");
	}

}
