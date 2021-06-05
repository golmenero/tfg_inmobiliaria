package com.uniovi.tests.usecases;

import java.util.List;

import org.bson.Document;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_PropertyAdd;
import com.uniovi.tests.pageobjects.PO_UserLogin;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.MongoDBUtils;

public class TestsUseCase09 {
	
	// POSITIVO 1. Vivienda
	public void Prueba09_1(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "h1", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Añadir Propiedad
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "properties/add", "h2", "¿Qué tipo de propiedad desea añadir?");

		// Seleccionamos la opción "Vivienda"
		elementos = PO_View.checkElement(driver, "id", "displayVivienda");
		elementos.get(0).click();

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Añada la información de la propiedad.");
		// Rellenamos la primera pantalla
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);

		// Comprobamos que se muestra la segunda pantalla
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
		// Rellenamos la segunda pantalla
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");

		// Comprobamos que se muestra la tercera pantalla
		PO_View.checkElement(driver, "text", "Añada las imágenes que desee.");
		// Rellenamos la tercera pantalla
		PO_PropertyAdd.fillFormPictures(driver, "D:\\workspaceEclipse\\ArcaInmobiliariaTest\\img\\picture1.jpg");

		// Comprobamos que se muestra la pantalla de resumen
		PO_View.checkElement(driver, "text", "Resumen de la información introducida.");
		// Comprobamos que la informacion introducida se muestra correctamente
		PO_View.checkElement(driver, "dd", "Venta");
		PO_View.checkElement(driver, "text", "Nombre Propiedad 1");
		PO_View.checkElement(driver, "text", "Direccion Propiedad 1");
		PO_View.checkElement(driver, "text", "P-3");
		PO_View.checkElement(driver, "text", "Descripcion propiedad 1");
		PO_View.checkElement(driver, "dd", "vivienda");
		PO_View.checkElement(driver, "text", "Ciudad1");
		PO_View.checkElement(driver, "text", "200 m");
		PO_View.checkElement(driver, "text", "750 €");
		PO_View.checkElement(driver, "text", "100 €");
		PO_View.checkElement(driver, "text", "Propietario1 Propietarito1");
		PO_View.checkElement(driver, "text", "propietario1@propietario.com");
		PO_View.checkElement(driver, "text", "Direccion Propietario 1");
		PO_View.checkElement(driver, "text", "00000000P");
		PO_View.checkElement(driver, "text", "66666666");

		// Confirmamos los datos
		PO_PropertyAdd.confirmAddProperty(driver);
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "La propiedad se añadió correctamente.");
		
		// Comprobamos que la propiedad se creó correctamente
		mdb.exists("properties", new Document("type","vivienda").append("code", "V001").append("typeOp", "Venta")
				.append("name", "Nombre Propiedad 1").append("address", "Direccion Propiedad 1").append("floor", 3)
				.append("description", "Descripcion propiedad 1").append("city", "Ciudad1").append("area", 200)
				.append("numHabs", 2).append("numBan", 1).append("price", 750).append("priceCom", 100)
				.append("garaje", true).append("piscina", false).append("terraza", true).append("trastero", false)
				.append("jardin", true).append("ascensor", false).append("calefaccion", true).append("aireAcon", false)
				.append("amueblado", true).append("animales", false));
	}

	// POSITIVO 2. Local
	public void Prueba09_2(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "h1", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Añadir Propiedad
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "properties/add", "h2", "¿Qué tipo de propiedad desea añadir?");

		// Seleccionamos la opción "Local"
		elementos = PO_View.checkElement(driver, "id", "displayLocal");
		elementos.get(0).click();

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Añada la información de la propiedad.");
		// Rellenamos la primera pantalla
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);

		// Comprobamos que se muestra la segunda pantalla
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
		// Rellenamos la segunda pantalla
		PO_PropertyAdd.fillFormOwner(driver, "Propietario2", "Propietarito2", "00000001P", "666666667",
				"propietario2@propietario.com", "Direccion Propietario 2");

		// Comprobamos que se muestra la tercera pantalla
		PO_View.checkElement(driver, "text", "Añada las imágenes que desee.");
		// Rellenamos la tercera pantalla
		PO_PropertyAdd.fillFormPictures(driver, "D:\\workspaceEclipse\\ArcaInmobiliariaTest\\img\\picture1.jpg");

		// Comprobamos que se muestra la pantalla de resumen
		PO_View.checkElement(driver, "text", "Resumen de la información introducida.");
		// Comprobamos que la informacion introducida se muestra correctamente
		PO_View.checkElement(driver, "dd", "Alquiler");
		PO_View.checkElement(driver, "text", "Nombre Propiedad 1");
		PO_View.checkElement(driver, "text", "Direccion Propiedad 1");
		PO_View.checkElement(driver, "text", "P-3");
		PO_View.checkElement(driver, "text", "Descripcion propiedad 1");
		PO_View.checkElement(driver, "dd", "local");
		PO_View.checkElement(driver, "text", "Ciudad1");
		PO_View.checkElement(driver, "text", "300 m");
		PO_View.checkElement(driver, "text", "300 €");
		PO_View.checkElement(driver, "text", "100 €");
		PO_View.checkElement(driver, "text", "Propietario2 Propietarito2");
		PO_View.checkElement(driver, "text", "propietario2@propietario.com");
		PO_View.checkElement(driver, "text", "Direccion Propietario 2");
		PO_View.checkElement(driver, "text", "00000001P");
		PO_View.checkElement(driver, "text", "666666667");

		// Confirmamos los datos
		PO_PropertyAdd.confirmAddProperty(driver);
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "La propiedad se añadió correctamente.");

		// Comprobamos que la propiedad se creó correctamente
		mdb.exists("properties", new Document("type","local").append("code", "L001").append("typeOp", "Alquiler")
				.append("name", "Nombre Propiedad 1").append("address", "Direccion Propiedad 1").append("floor", 3)
				.append("description", "Descripcion propiedad 1").append("city", "Ciudad1").append("area", 300)
				.append("numAseos", 3).append("price", 300).append("priceCom", 100)
				.append("escaparate", true).append("aparcamiento", false).append("cargaYdescarga", true).append("extintores", false)
				.append("iluminacion", true).append("calefaccion", false).append("aireAcon", true));
		
		// Comprobamos que se ha creado el nuevo propietario
		mdb.exists("owners", new Document("name","Propietario2").append("surname", "Propietarito2")
				.append("dni", "00000001P").append("phone", 666666667).append("email", "propietario2@propietario.com")
				.append("address", "Direccion Propietario 2"));
	}

	// POSITIVO 3. Suelo
	public void Prueba09_3(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "h1", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Añadir Propiedad
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "properties/add", "h2", "¿Qué tipo de propiedad desea añadir?");

		// Seleccionamos la opción "Local"
		elementos = PO_View.checkElement(driver, "id", "displaySuelo");
		elementos.get(0).click();

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Añada la información de la propiedad.");
		// Rellenamos la primera pantalla
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1", "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "400", "200", "700", true, false);

		// Comprobamos que se muestra la segunda pantalla
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
		// Rellenamos la segunda pantalla
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");

		// Comprobamos que se muestra la tercera pantalla
		PO_View.checkElement(driver, "text", "Añada las imágenes que desee.");
		// Rellenamos la tercera pantalla
		PO_PropertyAdd.fillFormPictures(driver, "D:\\workspaceEclipse\\ArcaInmobiliariaTest\\img\\picture1.jpg");

		// Comprobamos que se muestra la pantalla de resumen
		PO_View.checkElement(driver, "text", "Resumen de la información introducida.");
		// Comprobamos que la informacion introducida se muestra correctamente
		PO_View.checkElement(driver, "dd", "Alquiler");
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
		PO_PropertyAdd.confirmAddProperty(driver);
		PO_View.esperaPantallaDeCarga(driver);
		// Comprobamos que se muestra el mensaje correctamente
		PO_View.checkElement(driver, "text", "La propiedad se añadió correctamente.");

		// Comprobamos que la propiedad se creó correctamente
		mdb.exists("properties", new Document("type","suelo").append("code", "S001").append("typeOp", "Alquiler")
				.append("name", "Nombre Propiedad 1").append("description", "Descripcion propiedad 1").append("city", "Ciudad1")
				.append("situation", "Situacion1").append("area", 400).append("edifArea", 200).append("price", 700)
				.append("accesoAgua", true).append("accesoLuz", false));
	}

	// NEGATIVO 1. Vivienda - Introducir datos Inválidos
	public void PruebaN09_1(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "h1", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Añadir Propiedad
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "properties/add", "h2", "¿Qué tipo de propiedad desea añadir?");

		// Seleccionamos la opción "Vivienda"
		elementos = PO_View.checkElement(driver, "id", "displayVivienda");
		elementos.get(0).click();

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Añada la información de la propiedad.");

		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormVivienda(driver, "", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3", "",
				"Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true, false, true, false, true,
				false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "", "200", "2", "1", "750", "100", true, false, true, false, true, false,
				true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "", "2", "1", "750", "100", true, false, true, false, true, false,
				true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "", "100", true, false, true, false, true, false,
				true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "", true, false, true, false, true, false,
				true, false, true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");

		// Ahora comprobamos que respeta los tamaños minimos (los máximos los restringe
		// automaticamente).
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "N", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "D", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "20000",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"D", "Ciudad1", "200", "2", "1", "750", "100", true, false, true, false, true, false, true, false, true,
				false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "C", "200", "2", "1", "750", "100", true, false, true, false, true, false,
				true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "1", "2", "1", "750", "100", true, false, true, false, true,
				false, true, false, true, false);
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "100000000000", "100", true, false, true, false,
				true, false, true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormVivienda(driver, "V001", "Venta", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "200", "2", "1", "750", "100000", true, false, true, false, true,
				false, true, false, true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
	}

	// NEGATIVO 2. Local - Introducir datos Inválidos
	public void PruebaN09_2(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "h1", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Añadir Propiedad
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "properties/add", "h2", "¿Qué tipo de propiedad desea añadir?");

		// Seleccionamos la opción "Local"
		elementos = PO_View.checkElement(driver, "id", "displayLocal");
		elementos.get(0).click();

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Añada la información de la propiedad.");

		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormLocal(driver, "", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormLocal(driver, "L001", "", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3", "",
				"Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false, true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "", "300", "3", "300", "100", true, false, true, false, true, false, true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "", true, false, true, false, true, false,
				true);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");

		// Ahora comprobamos que respeta los tamaños minimos (los máximos los restringe
		// automaticamente).
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "N", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "D", "3",
				"Descripcion propiedad 1", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"D", "Ciudad1", "300", "3", "300", "100", true, false, true, false, true, false, true);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "C", "300", "3", "300", "100", true, false, true, false, true, false, true);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormLocal(driver, "L001", "Alquiler", "Nombre Propiedad 1", "Direccion Propiedad 1", "3",
				"Descripcion propiedad 1", "Ciudad1", "3", "3", "300", "100", true, false, true, false, true, false,
				true);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
	}

	// NEGATIVO 3. Suelo - Introducir datos Inválidos
	public void PruebaN09_3(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "h1", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Añadir Propiedad
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "properties/add", "h2", "¿Qué tipo de propiedad desea añadir?");

		// Seleccionamos la opción "Local"
		elementos = PO_View.checkElement(driver, "id", "displaySuelo");
		elementos.get(0).click();

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Añada la información de la propiedad.");
		// Rellenamos la pantalla vacía y probamos dejando vacíos diferentes campos
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "",  "Descripcion propiedad 1", "Ciudad1",
				"Situacion1", "400", "200", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "", "Ciudad1", "Situacion1",
				"400", "200", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"", "Situacion1", "400", "200", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "", "400", "200", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "", "200", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "400", "", "700", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "400", "200", "", true, false);
		// Comprobamos que nos muestra el mensaje de error
		PO_View.checkElement(driver, "text", "Rellene todos los campos, por favor.");

		// Ahora comprobamos que respeta los tamaños minimos (los máximos los restringe
		// automaticamente).
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "N",  "Descripcion propiedad 1", "Ciudad1",
				"Situacion1", "400", "200", "", true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "D", "Ciudad1",
				"Situacion1", "400", "200", "700", true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"C", "Situacion1", "400", "200", "700", true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "S", "400", "200", "700", true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "4", "200", "700", true, false);
		// Comprobamos que nos deja en la primera pantalla
		PO_View.checkElement(driver, "h2", "Añada la información de la propiedad.");
	}

	// NEGATIVO 4. Propietario - Introducir datos inválidos
	public void PruebaN09_4(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "h1", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Añadir Propiedad
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "properties/add", "h2", "¿Qué tipo de propiedad desea añadir?");
		// Seleccionamos la opción "Local"
		elementos = PO_View.checkElement(driver, "id", "displaySuelo");
		elementos.get(0).click();

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Añada la información de la propiedad.");
		// Rellenamos la primera pantalla
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "400", "200", "700", true, false);

		// Comprobamos que se muestra la segunda pantalla
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
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
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "P", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "0", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "6",
				"propietario1@propietario.com", "Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666", "p@p.c",
				"Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666", "P",
				"Direccion Propietario 1");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "D");
		// Comprobamos que nos muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
	}

	// NEGATIVO 5. Imágenes – Introducir datos inválidos
	public void PruebaN09_5(WebDriver driver, MongoDBUtils mdb) {
		// Iniciamos sesión con el super agente
		PO_NavView.clickOption(driver, "login", "h1", "Identificación de usuario");
		PO_UserLogin.fillForm(driver, "superagente@superagente.com", "adminadmin");
		// Vamos a la opcion de Añadir Propiedad
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "propiedadesMenu");
		elementos.get(0).click();
		PO_NavView.clickOption(driver, "properties/add", "h2", "¿Qué tipo de propiedad desea añadir?");

		// Seleccionamos la opción "Local"
		elementos = PO_View.checkElement(driver, "id", "displaySuelo");
		elementos.get(0).click();

		// Comprobamos que se muestra la primera pantalla
		PO_View.checkElement(driver, "text", "Añada la información de la propiedad.");
		// Rellenamos la primera pantalla
		PO_PropertyAdd.fillFormSuelo(driver, "S001", "Alquiler", "Nombre Propiedad 1",  "Descripcion propiedad 1",
				"Ciudad1", "Situacion1", "400", "200", "700", true, false);

		// Comprobamos que se muestra la segunda pantalla
		PO_View.checkElement(driver, "text", "Añada la información del propietario.");
		// Rellenamos la segunda pantalla
		PO_PropertyAdd.fillFormOwner(driver, "Propietario1", "Propietarito1", "00000000P", "666666666",
				"propietario1@propietario.com", "Direccion Propietario 1");

		// Comprobamos que se muestra la tercera pantalla
		PO_View.checkElement(driver, "text", "Añada las imágenes que desee.");
		// Dejamos la tercera pantalla sin importar y pulsamos el boton
		PO_PropertyAdd.justPulseBtn(driver);

		// Comprobamos que seguimos en la tercera pantalla y muestra un mensaje de error
		PO_View.checkElement(driver, "text", "Añada las imágenes que desee.");
		PO_View.checkElement(driver, "text", "Seleccione, al menos, una imagen, por favor.");
	}

}
