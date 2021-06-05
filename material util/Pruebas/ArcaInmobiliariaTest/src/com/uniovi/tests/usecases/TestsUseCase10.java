package com.uniovi.tests.usecases;

import java.util.List;

import org.bson.Document;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_PropertyAdd;
import com.uniovi.tests.pageobjects.PO_PropertyEdit;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase10 {

	// POSITIVO 1. Vivienda
	@Test
	public void Prueba10_1(WebDriver driver, MongoDBUtils mdb) {
		// Comprobamos que la propiedad existe
		mdb.exists("properties",  new Document("type", "vivienda").append("code", "VP01").append("typeOp", "Venta")
				.append("name", "Vivienda 1").append("address", "Calle Vivienda 1").append("floor", 3)
				.append("description", "Descripcion Vivienda 1").append("city", "Ciudad Vivienda 1").append("area", 100)
				.append("numHabs", 2).append("numBan", 1).append("price", 1000).append("priceCom", 100)
				.append("garaje", true).append("piscina", false).append("terraza", true).append("trastero", false)
				.append("jardin", true).append("ascensor", false).append("calefaccion", true).append("aireAcon", false)
				.append("amueblado", true).append("animales", false));

		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Mis Propiedades
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "myproperties", "h1", "Propiedades Publicadas");

		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/edit')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);
		
		// Rellenamos la primera pantalla
		PO_PropertyEdit.fillFormVivienda(driver, "V100", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "4",
				"Descripcion propiedad 1", "Ciudad1", "200", "3", "3", "750", "50", false, true, false, true, false,
				true, false, true, false, true);
		// Comprobamos que se muestra la segunda pantalla
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		// Rellenamos la segunda pantalla
		PO_PropertyEdit.fillFormOwner(driver, "Propietario2", "Propietarito2", "00000001P", "666666667",
				"propietario2@propietario.com", "Direccion Propietario 2");

		// Comprobamos que se muestra la tercera pantalla
		PO_View.checkElement(driver, "text", "Introduzca las nuevas imágenes.");
		// Rellenamos la tercera pantalla
		PO_PropertyEdit.fillFormPictures(driver, "D:\\workspaceEclipse\\ArcaInmobiliariaTest\\img\\picture1.jpg");

		// Comprobamos que se muestra la pantalla de resumen
		PO_View.checkElement(driver, "text", "Resumen de datos modificados.");
		// Comprobamos que la informacion introducida se muestra correctamente
		PO_View.checkElement(driver, "dd", "Alquiler");
		PO_View.checkElement(driver, "text", "Nombre Propiedad 1");
		PO_View.checkElement(driver, "text", "Direccion Propiedad 1");
		PO_View.checkElement(driver, "text", "P-4");
		PO_View.checkElement(driver, "text", "Descripcion propiedad 1");
		PO_View.checkElement(driver, "dd", "vivienda");
		PO_View.checkElement(driver, "text", "Ciudad1");
		PO_View.checkElement(driver, "text", "200 m");
		PO_View.checkElement(driver, "text", "750 €");
		PO_View.checkElement(driver, "text", "50 €");
		PO_View.checkElement(driver, "text", "Propietario2 Propietarito2");
		PO_View.checkElement(driver, "text", "propietario2@propietario.com");
		PO_View.checkElement(driver, "text", "Direccion Propietario 2");
		PO_View.checkElement(driver, "text", "00000001P");
		PO_View.checkElement(driver, "text", "666666667");

		// Confirmamos los datos
		PO_PropertyEdit.confirmEditProperty(driver);
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "Propiedad editada correctamente.");
		
		// Comprobamos que la propiedad se edito correctamente
		mdb.exists("properties", new Document("type", "vivienda").append("code", "V100").append("typeOp", "Alquiler")
				.append("name", "Nombre Propiedad 1").append("address", "Direccion Propiedad 1").append("floor", 4)
				.append("description", "Descripcion propiedad 1").append("city", "Ciudad1").append("area", 200)
				.append("numHabs", 3).append("numBan", 3).append("price", 750).append("priceCom", 50)
				.append("garaje", false).append("piscina", true).append("terraza", false).append("trastero", true)
				.append("jardin", false).append("ascensor", true).append("calefaccion", false).append("aireAcon", true)
				.append("amueblado", false).append("animales", true));
		
		// Comprobamos que se ha creado el nuevo propietario\
		mdb.exists("owners", new Document("name","Propietario2").append("surname", "Propietarito2")
				.append("dni", "00000001P").append("phone", 666666667).append("email", "propietario2@propietario.com")
				.append("address", "Direccion Propietario 2"));
	}

	// PRUEBA 10.2. EDITAR PROPIEDAD - LOCAL
	@Test
	public void Prueba10_2(WebDriver driver, MongoDBUtils mdb) {
		// Comprobamos que la propiedad existe
		mdb.exists("properties",  new Document("type", "local").append("code", "LP01").append("typeOp", "Venta")
				.append("name", "Local 1").append("address", "Calle Local 1").append("floor", 3)
				.append("description", "Descripcion Local 1").append("city", "Ciudad Local 1").append("area", 500)
				.append("numAseos", 2).append("price", 1000).append("priceCom", 100).append("escaparate", true)
				.append("aparcamiento", false).append("cargaYdescarga", true).append("extintores", false)
				.append("iluminacion", true).append("calefaccion", false).append("aireAcon", true));
		
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Mis Propiedades
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "myproperties", "h1", "Propiedades Publicadas");

		// Seleccionamos el icono de Editar junto a la primera propiedad, la cual es un
		// "Local"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/edit')]");
		elementos.get(1).click();
		PO_View.esperaPantallaDeCarga(driver);

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Edite la información de la propiedad.");
		// Rellenamos la primera pantalla
		PO_PropertyEdit.fillFormLocal(driver, "L100", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "4",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "50", false, true, false, true, false, true,
				false);
		// Comprobamos que se muestra la segunda pantalla
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		// Rellenamos la segunda pantalla
		PO_PropertyEdit.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");

		// Comprobamos que se muestra la tercera pantalla
		PO_View.checkElement(driver, "text", "Introduzca las nuevas imágenes.");
		// Rellenamos la tercera pantalla
		PO_PropertyEdit.fillFormPictures(driver, "D:\\workspaceEclipse\\ArcaInmobiliariaTest\\img\\picture1.jpg");

		// Comprobamos que se muestra la pantalla de resumen
		PO_View.checkElement(driver, "text", "Resumen de datos modificados.");
		// Comprobamos que la informacion introducida se muestra correctamente
		PO_View.checkElement(driver, "dd", "Alquiler");
		PO_View.checkElement(driver, "text", "Nombre Propiedad 1");
		PO_View.checkElement(driver, "text", "Direccion Propiedad 1");
		PO_View.checkElement(driver, "text", "P-4");
		PO_View.checkElement(driver, "text", "Descripcion propiedad 1");
		PO_View.checkElement(driver, "dd", "local");
		PO_View.checkElement(driver, "text", "Ciudad1");
		PO_View.checkElement(driver, "text", "300 m");
		PO_View.checkElement(driver, "text", "300 €");
		PO_View.checkElement(driver, "text", "50 €");
		PO_View.checkElement(driver, "text", "Propietario1 Propietarito1");
		PO_View.checkElement(driver, "text", "propietario1@propietario.com");
		PO_View.checkElement(driver, "text", "Direccion Propietario 1");
		PO_View.checkElement(driver, "text", "00000000P");
		PO_View.checkElement(driver, "text", "66666666");

		// Confirmamos los datos
		PO_PropertyEdit.confirmEditProperty(driver);
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "Propiedad editada correctamente.");
		
		// Comprobamos que la propiedad se edito correctamente
		mdb.exists("properties",  new Document("type", "local").append("code", "L100").append("typeOp", "Alquiler")
				.append("name", "Nombre Propiedad 1").append("address", "Direccion Propiedad 1").append("floor", 4)
				.append("description", "Descripcion propiedad 1").append("city", "Ciudad1").append("area", 300)
				.append("numAseos", 3).append("price", 300).append("priceCom", 50).append("escaparate", false)
				.append("aparcamiento", true).append("cargaYdescarga", false).append("extintores", true)
				.append("iluminacion", false).append("calefaccion", true).append("aireAcon", false));
	}

	// PRUEBA 10.3. EDITAR PROPIEDAD - SUELO
	@Test
	public void Prueba10_3(WebDriver driver, MongoDBUtils mdb) {
		// Comprobamos que existe la propiedad
		mdb.exists("properties",  new Document("type", "suelo").append("code", "SP01").append("typeOp", "Alquiler")
				.append("name", "Suelo 1").append("description", "Descripcion Suelo 1").append("city", "Ciudad Suelo 1")
				.append("situation", "Situacion Suelo 1").append("area", 500).append("edifArea", 250)
				.append("price", 10000).append("accesoAgua", true).append("accesoLuz", false));
		
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Mis Propiedades
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "myproperties", "h1", "Propiedades Publicadas");

		// Seleccionamos el icono de Editar junto a la primera propiedad, la cual es un
		// "Suelo"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/edit')]");
		elementos.get(2).click();
		PO_View.esperaPantallaDeCarga(driver);

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Edite la información de la propiedad.");
		// Rellenamos la primera pantalla
		PO_PropertyEdit.fillFormSuelo(driver, "S100", "Venta", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "400", "200", "700", false, true);
		// Comprobamos que se muestra la segunda pantalla
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		// Rellenamos la segunda pantalla
		PO_PropertyEdit.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");

		// Comprobamos que se muestra la tercera pantalla
		PO_View.checkElement(driver, "text", "Introduzca las nuevas imágenes.");
		// Rellenamos la tercera pantalla
		PO_PropertyEdit.fillFormPictures(driver, "D:\\workspaceEclipse\\ArcaInmobiliariaTest\\img\\picture1.jpg");

		// Comprobamos que se muestra la pantalla de resumen
		PO_View.checkElement(driver, "text", "Resumen de datos modificados.");
		// Comprobamos que la informacion introducida se muestra correctamente
		PO_View.checkElement(driver, "dd", "Venta");
		PO_View.checkElement(driver, "text", "Nombre Propiedad 1");
		PO_View.checkElement(driver, "text", "Descripcion propiedad 1");
		PO_View.checkElement(driver, "dd", "suelo");
		PO_View.checkElement(driver, "text", "Ciudad1");
		PO_View.checkElement(driver, "text", "400 m");
		PO_View.checkElement(driver, "text", "200 m");
		PO_View.checkElement(driver, "text", "700 €");
		PO_View.checkElement(driver, "text", "Propietario1 Propietarito1");
		PO_View.checkElement(driver, "text", "propietario1@propietario.com");
		PO_View.checkElement(driver, "text", "Direccion Propietario 1");
		PO_View.checkElement(driver, "text", "00000000P");
		PO_View.checkElement(driver, "text", "66666666");

		// Confirmamos los datos
		PO_PropertyEdit.confirmEditProperty(driver);
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "Propiedad editada correctamente.");
		
		// Comprobamos que aparece la propiedad
		mdb.exists("properties",  new Document("type", "suelo").append("code", "S100").append("typeOp", "Venta")
				.append("name", "Nombre Propiedad 1").append("description", "Descripcion propiedad 1").append("city", "Ciudad1")
				.append("situation", "Situacion1").append("area", 400).append("edifArea", 200)
				.append("price", 700).append("accesoAgua", false).append("accesoLuz", true));
	}

	// NEGATIVO 10.1 Vivienda Datos Incorrectos
	public void PruebaN10_1(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Mis Propiedades
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "myproperties", "h1", "Propiedades Publicadas");

		// Seleccionamos el icono de Editar junto a la primera propiedad, la cual es una
		// "Vivienda"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/edit')]");
		elementos.get(0).click();
		PO_View.esperaPantallaDeCarga(driver);

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Edite la información de la propiedad.");

		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormVivienda(driver, "", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true, false, true, false, true,
				false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "", "200", "2", "1", "750", "100", true, false, true, false, true, false,
				true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "", "2", "1", "750", "100", true, false, true, false, true, false,
				true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "", "100", true, false, true, false, true, false,
				true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "", true, false, true, false, true, false,
				true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");

		// Ahora comprobamos que respeta los tamaños minimos (los máximos los restringe
		// automaticamente).
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "N", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "D", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1",
				"20000", "Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false,
				true, false, true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"D", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true, false, true, false, true,
				false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "C", "200", "2", "1", "750", "100", true, false, true, false, true, false,
				true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "1", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "100000000000", "100", true, false, true, false,
				true, false, true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100000", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
	}

	// NEGATIVO 10.2 Local Datos Incorrectos
	public void PruebaN10_2(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Mis Propiedades
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "myproperties", "h1", "Propiedades Publicadas");

		// Seleccionamos el icono de Editar junto a la primera propiedad, la cual es un
		// "Local"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/edit')]");
		elementos.get(1).click();
		PO_View.esperaPantallaDeCarga(driver);

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Edite la información de la propiedad.");

		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormLocal(driver, "", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormLocal(driver, "L001", "", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false, true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "", "300", "3", "300", "100", true, false, true, false, true, false, true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");

		// Ahora comprobamos que respeta los tamaños minimos (los máximos los restringe
		// automaticamente).
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "N", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "D", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"D", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false, true);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "C", "300", "3", "300", "100", true, false, true, false, true, false, true);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "3", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
	}

	// NEGATIVO 10.3 Suelo Datos Incorrectos
	public void PruebaN10_3(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Mis Propiedades
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "myproperties", "h1", "Propiedades Publicadas");

		// Seleccionamos el icono de Editar junto a la primera propiedad, la cual es un
		// "Suelo"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/edit')]");
		elementos.get(2).click();
		PO_View.esperaPantallaDeCarga(driver);

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Edite la información de la propiedad.");

		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "",  "Descripcion propiedad 1", "Ciudad1",
				"Situacion1", "400", "200", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "", "Ciudad1",
				"Situacion1", "400", "200", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"", "Situacion1", "400", "200", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "", "400", "200", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "", "200", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "400", "", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "400", "200", "", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");

		// Ahora comprobamos que respeta los tamaños minimos (los máximos los restringe
		// automaticamente).
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "N",  "Descripcion propiedad 1", "Ciudad1",
				"Situacion1", "400", "200", "", true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "D", "Ciudad1",
				"Situacion1", "400", "200", "700", true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"C", "Situacion1", "400", "200", "700", true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1", "Descripcion propiedad 1",
				"Ciudad1", "S", "400", "200", "700", true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
		PO_PropertyEdit.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "4", "200", "700", true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Edite la información de la propiedad.");
	}

	// NEGATIVO 10.4 Propietario – Introducir datos inválidos
	public void PruebaN10_4(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Mis Propiedades
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "myproperties", "h1", "Propiedades Publicadas");

		// Seleccionamos el icono de Editar junto a la primera propiedad, la cual es un
		// "Suelo"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/edit')]");
		elementos.get(2).click();
		PO_View.esperaPantallaDeCarga(driver);

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Edite la información de la propiedad.");

		// Rellenamos la primera pantalla
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1", "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "400", "200", "700", true, false);

		// Comprobamos que se muestra la segunda pantalla
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormOwner(driver, "", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666", "",
				"Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");

		// Ahora comprobamos que respeta los tamaños minimos (los máximos los restringe
		// automaticamente).
		PO_PropertyAdd.fillFormOwner(driver, "P", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que seguimos en la segunda pantalla
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "P", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "0", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "6",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666", "p@p.c",
				"Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666", "P",
				"Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "D");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
	}

	// NEGATIVO 10.5 Imágenes – Introducir datos inválidos
	public void PruebaN10_5(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "text", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Mis Propiedades
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "myproperties", "h1", "Propiedades Publicadas");

		// Seleccionamos el icono de Editar junto a la primera propiedad, la cual es un
		// "Suelo"
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, '/properties/edit')]");
		elementos.get(2).click();
		PO_View.esperaPantallaDeCarga(driver);

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Edite la información de la propiedad.");

		// Rellenamos la primera pantalla
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1", "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "400", "200", "700", true, false);

		// Comprobamos que se muestra la segunda pantalla
		PO_View.checkElement(driver, "text", "Edite la información del propietario.");
		// Rellenamos la segunda pantalla
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");

		// Comprobamos que se muestra la tercera pantalla
		PO_View.checkElement(driver, "text", "Introduzca las nuevas imágenes.");
		// Dejamos la tercera pantalla sin importar y pulsamos el boton
		PO_PropertyAdd.justPulseBtn(driver);

		// Comprobamos que seguimos en la tercera pantalla y muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Introduzca las nuevas imágenes.");
		PO_View.checkElement(driver, "text", "Seleccione, al menos, una imagen, por favor.");
	}
}
