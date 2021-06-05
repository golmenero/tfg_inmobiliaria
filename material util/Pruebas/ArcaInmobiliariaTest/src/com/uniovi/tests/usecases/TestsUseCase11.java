package com.uniovi.tests.usecases;

import java.util.List;

import org.bson.Document;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase11 {

	// PRUEBA 11.1. ELIMINAR PROPIEDAD
	@Test
	public void Prueba11(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Mis Propiedades
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "myproperties", "h1", "Propiedades Publicadas");

		// Seleccionamos el icono de Eliminar junto a la primera propiedad, la cual es
		// una "Vivienda"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/delete')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);

		// Comprobamos que se muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "Propiedad eliminada correctamente.");

		// Seleccionamos el icono de Eliminar junto a la siguiente propiedad, la cual es
		// un "Local"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/delete')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);

		// Comprobamos que se muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "Propiedad eliminada correctamente.");

		// Seleccionamos el icono de Eliminar junto a la siguiente propiedad, la cual es
		// un "Suelo"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/delete')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);

		// Comprobamos que se muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "Propiedad eliminada correctamente.");
		
		// Comprobamos que la propiedad no aparece mas
		mdb.doesNotExist("properties", new Document("type", "vivienda").append("code", "VP01").append("typeOp", "Venta")
				.append("name", "Vivienda 1").append("address", "Calle Vivienda 1").append("floor", 3)
				.append("description", "Descripcion Vivienda 1").append("city", "Ciudad Vivienda 1").append("area", 100)
				.append("numHabs", 2).append("numBan", 1).append("price", 1000).append("priceCom", 100)
				.append("garaje", true).append("piscina", false).append("terraza", true).append("trastero", false)
				.append("jardin", true).append("ascensor", false).append("calefaccion", true).append("aireAcon", false)
				.append("amueblado", true).append("animales", false));
	}
}
