package com.uniovi.tests.usecases;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase13 {
	// PRUEBA 13.1. VER DETALLES DE PROPIEDAD - VIVIENDA
	@Test
	public void Prueba13_1(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Propiedades >> Viviendas
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/vivienda')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Seleccionamos la primera de las propiedades
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/details')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestran los detalles
		PO_View.checkElement(driver, "text", "Detalles de Vivienda 1");
		PO_View.checkElement(driver, "text", "Código: VP01");
		PO_View.checkElement(driver, "text", "Precio de Venta: 1000 €");
		PO_View.checkElement(driver, "text", "100 € de Gastos de Comunidad");
		PO_View.checkElement(driver, "text", "Descripcion Vivienda 1");
		PO_View.checkElement(driver, "text", "Calle Vivienda 1");
		PO_View.checkElement(driver, "text", "Ciudad Vivienda 1");
		PO_View.checkElement(driver, "text", "3 Piso");
		PO_View.checkElement(driver, "text", "100 m");
		PO_View.checkElement(driver, "text", "2 Habs.");
		PO_View.checkElement(driver, "text", "1 Baños");
		// Comprobamos que hay 5 elementos ocultos
		elementos = PO_View.checkElement(driver, "class", "opacidadIcono");
		assertEquals(elementos.size(), 5);
		PO_View.checkElement(driver, "text", "Garaje");
		PO_View.checkElement(driver, "text", "Piscina");
		PO_View.checkElement(driver, "text", "Terraza");
		PO_View.checkElement(driver, "text", "Trastero");
		PO_View.checkElement(driver, "text", "Jardín");
		PO_View.checkElement(driver, "text", "Ascensor");
		PO_View.checkElement(driver, "text", "Calefacción");
		PO_View.checkElement(driver, "text", "Aire Acond.");
		PO_View.checkElement(driver, "text", "Amueblado");
		PO_View.checkElement(driver, "text", "Permite Animales");

		// Pulsamos el boton de Datos del Propietario
		elementos = PO_View.checkElement(driver, "id", "btnDatosPropietario");
		elementos.get(0).click();
		// Comprobamos que se muestran los datos
		PO_View.checkElement(driver, "text", "Propietario 1 Apellido Propietario 1");
		PO_View.checkElement(driver, "text", "00000000A");
		PO_View.checkElement(driver, "text", "666666666");
		PO_View.checkElement(driver, "text", "propietario1@propietario.com");
		PO_View.checkElement(driver, "text", "Direccion Propietario 1");
	}

	// PRUEBA 13.2. VER DETALLES DE PROPIEDAD - LOCAL
	@Test
	public void Prueba13_2(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Propiedades >> Locales
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "inicioMenu");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/local')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Seleccionamos la primera de las propiedades
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/details')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestran los detalles
		PO_View.checkElement(driver, "text", "Detalles de Local 1");
		PO_View.checkElement(driver, "text", "Código: LP01");
		PO_View.checkElement(driver, "text", "Precio de Venta: 1000 €");
		PO_View.checkElement(driver, "text", "100 € de Gastos de Comunidad");
		PO_View.checkElement(driver, "text", "Descripcion Local 1");
		PO_View.checkElement(driver, "text", "Calle Local 1");
		PO_View.checkElement(driver, "text", "Ciudad Local 1");
		PO_View.checkElement(driver, "text", "3 Piso");
		PO_View.checkElement(driver, "text", "500 m");
		PO_View.checkElement(driver, "text", "2 Aseos");
		// Comprobamos que hay 3 elementos ocultos
		elementos = PO_View.checkElement(driver, "class", "opacidadIcono");
		assertEquals(elementos.size(), 3);
		PO_View.checkElement(driver, "text", "Calefacción");
		PO_View.checkElement(driver, "text", "Aire Acond.");
		PO_View.checkElement(driver, "text", "Escaparate");
		PO_View.checkElement(driver, "text", "Aparcamiento");
		PO_View.checkElement(driver, "text", "Carga y Descarga");
		PO_View.checkElement(driver, "text", "Extintores");
		PO_View.checkElement(driver, "text", "Iluminación");

		// Pulsamos el boton de Datos del Propietario
		elementos = PO_View.checkElement(driver, "id", "btnDatosPropietario");
		elementos.get(0).click();
		// Comprobamos que se muestran los datos
		PO_View.checkElement(driver, "text", "Propietario 1 Apellido Propietario 1");
		PO_View.checkElement(driver, "text", "00000000A");
		PO_View.checkElement(driver, "text", "666666666");
		PO_View.checkElement(driver, "text", "propietario1@propietario.com");
		PO_View.checkElement(driver, "text", "Direccion Propietario 1");
	}

	// PRUEBA 13.2. VER DETALLES DE PROPIEDAD - LOCAL
	@Test
	public void Prueba13_3(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
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
		PO_View.checkElement(driver, "text", "Código: SP01");
		PO_View.checkElement(driver, "text", "Precio de Alquiler: 10000 €");
		PO_View.checkElement(driver, "text", "Descripcion Suelo 1");
		PO_View.checkElement(driver, "text", "Situacion Suelo 1");
		PO_View.checkElement(driver, "text", "Ciudad Suelo 1");
		PO_View.checkElement(driver, "text", "500 m");
		PO_View.checkElement(driver, "text", "250 Area Edificable");
		// Comprobamos que hay 1 elemento oculto
		elementos = PO_View.checkElement(driver, "class", "opacidadIcono");
		assertEquals(elementos.size(), 1);
		PO_View.checkElement(driver, "text", "Acceso a Agua");
		PO_View.checkElement(driver, "text", "Acceso a Luz");

		// Pulsamos el boton de Datos del Propietario
		elementos = PO_View.checkElement(driver, "id", "btnDatosPropietario");
		elementos.get(0).click();
		// Comprobamos que se muestran los datos
		PO_View.checkElement(driver, "text", "Propietario 1 Apellido Propietario 1");
		PO_View.checkElement(driver, "text", "00000000A");
		PO_View.checkElement(driver, "text", "666666666");
		PO_View.checkElement(driver, "text", "propietario1@propietario.com");
		PO_View.checkElement(driver, "text", "Direccion Propietario 1");
	}
}
