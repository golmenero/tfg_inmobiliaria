package com.uniovi.tests.usecases;

import java.util.List;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase18 {
	// PRUEBA 18. VER MENSAJES RECIBIDOS
	@Test
	public void Prueba18(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el usuario
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "usuario1@usuario.com", "adminadmin");
		// Vamos a la opcion de Mensajes
		PO_NavView.clickOption(driver, "conversations", "h1", "Conversaciones Activas");
		// HAcemos click en Acceso junto a la primera conversacion
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/conversations/chat')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Nos aseguramos de que el mensaje aparece en el chat
		PO_View.checkElement(driver, "text", "General Kenobi");

	}
}
