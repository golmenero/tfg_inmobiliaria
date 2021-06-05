package com.uniovi;

import java.util.ArrayList;

import org.bson.Document;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.uniovi.tests.usecases.TestsUseCase00;
import com.uniovi.tests.usecases.TestsUseCase01;
import com.uniovi.tests.usecases.TestsUseCase02;
import com.uniovi.tests.usecases.TestsUseCase03;
import com.uniovi.tests.usecases.TestsUseCase04;
import com.uniovi.tests.usecases.TestsUseCase05;
import com.uniovi.tests.usecases.TestsUseCase06;
import com.uniovi.tests.usecases.TestsUseCase07;
import com.uniovi.tests.usecases.TestsUseCase08;
import com.uniovi.tests.usecases.TestsUseCase09;
import com.uniovi.tests.usecases.TestsUseCase10;
import com.uniovi.tests.usecases.TestsUseCase11;
import com.uniovi.tests.usecases.TestsUseCase12;
import com.uniovi.tests.usecases.TestsUseCase13;
import com.uniovi.tests.usecases.TestsUseCase14;
import com.uniovi.tests.usecases.TestsUseCase15;
import com.uniovi.tests.usecases.TestsUseCase16;
import com.uniovi.tests.usecases.TestsUseCase17;
import com.uniovi.tests.usecases.TestsUseCase18;
import com.uniovi.tests.usecases.TestsUseCase19;
import com.uniovi.tests.usecases.TestsUseCase20;
import com.uniovi.tests.usecases.TestsUseCase21;
import com.uniovi.tests.usecases.TestsUseCase22;
import com.uniovi.tests.usecases.TestsUseCase23;
import com.uniovi.tests.usecases.TestsUseCase24;
import com.uniovi.tests.util.MongoDBUtils;

public class WallapopApplicationTests {

	static String PathFirefox64 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	static String Geckdriver022 = "C:\\Users\\Carlos Gómez\\Desktop\\tfg_inmobiliaria\\material util\\Pruebas\\ArcaInmobiliariaTest\\geckodriver.exe";

	// driver, mdbS
	static WebDriver driver = getdriver(PathFirefox64, Geckdriver022);
	static String URL = "https://127.0.0.1:8081";

	MongoDBUtils mdb = new MongoDBUtils();

	public static WebDriver getdriver(String PathFirefox, String Geckdriver) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	// Antes de cada uno de los test, vamos a la URL base
	@Before
	public void setUp() {
		insertData();
		driver.navigate().to(URL);
	}

	// Borramos todas las cookies despues de cada test
	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	@BeforeClass
	static public void begin() {
	}

	@AfterClass
	static public void end() {
		driver.quit();
	}

	// #################### CASO DE USO 00 #################### SI
	@Test
	public void Prueba00() {
		new TestsUseCase00().Prueba00(driver, mdb);
	}

	// #################### CASO DE USO 01 #################### SI
	@Test
	public void Prueba01() {
		new TestsUseCase01().Prueba01(driver, mdb);
	}

	@Test
	public void PruebaN01_1() {
		new TestsUseCase01().PruebaN01_1(driver, mdb);
	}

	@Test
	public void PruebaN01_2() {
		new TestsUseCase01().PruebaN01_2(driver, mdb);
	}

	
	// #################### CASO DE USO 02 #################### SI
	@Test
	public void Prueba02() {
		new TestsUseCase02().Prueba02(driver, mdb);
	}

	@Test
	public void PruebaN02_1() {
		new TestsUseCase02().PruebaN02_1(driver, mdb);
	}

	@Test
	public void PruebaN02_2() {
		new TestsUseCase02().PruebaN02_2(driver, mdb);
	}
	

	// #################### CASO DE USO 03 #################### SI
	@Test
	public void Prueba03() {
		new TestsUseCase03().Prueba03(driver, mdb);
	}

	@Test
	public void PruebaN03_1() {
		new TestsUseCase03().PruebaN03_1(driver, mdb);
	}

	@Test
	public void PruebaN03_2() {
		new TestsUseCase03().PruebaN03_2(driver, mdb);
	}
	
	// #################### CASO DE USO 04 #################### SI
	@Test
	public void Prueba04() {
		new TestsUseCase04().Prueba04(driver, mdb);
	}

	@Test
	public void PruebaN04_1() {
		new TestsUseCase04().PruebaN04_1(driver, mdb);
	}

	@Test
	public void PruebaN04_2() {
		new TestsUseCase04().PruebaN04_2(driver, mdb);
	}


	// #################### CASO DE USO 05 #################### SI
	@Test
	public void Prueba05() {
		new TestsUseCase05().Prueba05(driver, mdb);
	}

	@Test
	public void PruebaN05_1() {
		new TestsUseCase05().PruebaN05_1(driver, mdb);
	}

	@Test
	public void PruebaN05_2() {
		new TestsUseCase05().PruebaN05_2(driver, mdb);
	}

	
	// #################### CASO DE USO 06 #################### SI
	@Test
	public void Prueba06() {
		new TestsUseCase06().Prueba06(driver, mdb);
	}

	// #################### CASO DE USO 07 #################### SI
	@Test
	public void Prueba07() {
		new TestsUseCase07().Prueba07(driver, mdb);
	}

	@Test
	public void PruebaN07_1() {
		new TestsUseCase07().PruebaN07_1(driver, mdb);
	}

	@Test
	public void PruebaN07_2() {
		new TestsUseCase07().PruebaN07_2(driver, mdb);
	}
	

	// #################### CASO DE USO 08 #################### SI
	@Test
	public void Prueba08() {
		new TestsUseCase08().Prueba08(driver, mdb);
	}
	

	// #################### CASO DE USO 09 #################### SI
	@Test
	public void Prueba09_1() {
		new TestsUseCase09().Prueba09_1(driver, mdb);
	}

	@Test
	public void Prueba09_2() {
		new TestsUseCase09().Prueba09_2(driver, mdb);
	}

	@Test
	public void Prueba09_3() {
		new TestsUseCase09().Prueba09_3(driver, mdb);
	}

	@Test
	public void PruebaN09_1() {
		new TestsUseCase09().PruebaN09_1(driver, mdb);
	}

	@Test
	public void PruebaN09_2() {
		new TestsUseCase09().PruebaN09_2(driver, mdb);
	}

	@Test
	public void PruebaN09_3() {
		new TestsUseCase09().PruebaN09_3(driver, mdb);
	}

	@Test
	public void PruebaN09_4() {
		new TestsUseCase09().PruebaN09_4(driver, mdb);
	}

	@Test
	public void PruebaN09_5() {
		new TestsUseCase09().PruebaN09_5(driver, mdb);
	}

	
	// #################### CASO DE USO 10 #################### SI
	@Test
	public void Prueba10_1() {
		new TestsUseCase10().Prueba10_1(driver, mdb);
	}

	@Test
	public void Prueba10_2() {
		new TestsUseCase10().Prueba10_2(driver, mdb);
	}

	@Test
	public void Prueba10_3() {
		new TestsUseCase10().Prueba10_3(driver, mdb);
	}

	@Test
	public void PruebaN10_1() {
		new TestsUseCase10().PruebaN10_1(driver, mdb);
	}

	@Test
	public void PruebaN10_2() {
		new TestsUseCase10().PruebaN10_2(driver, mdb);
	}

	@Test
	public void PruebaN10_3() {
		new TestsUseCase10().PruebaN10_3(driver, mdb);
	}

	@Test
	public void PruebaN10_4() {
		new TestsUseCase10().PruebaN10_4(driver, mdb);
	}

	@Test
	public void PruebaN10_5() {
		new TestsUseCase10().PruebaN10_5(driver, mdb);
	}
	

	// #################### CASO DE USO 11 ####################
	@Test
	public void Prueba11() {
		new TestsUseCase11().Prueba11(driver, mdb);
	}

	
	// #################### CASO DE USO 12 ####################
	@Test
	public void Prueba12_1() {
		new TestsUseCase12().Prueba12_1(driver, mdb);
	}

	@Test
	public void Prueba12_2() {
		new TestsUseCase12().Prueba12_2(driver, mdb);
	}

	@Test
	public void Prueba12_3() {
		new TestsUseCase12().Prueba12_3(driver, mdb);
	}

	
	// #################### CASO DE USO 13 ####################
	@Test
	public void Prueba13_1() {
		new TestsUseCase13().Prueba13_1(driver, mdb);
	}

	@Test
	public void Prueba13_2() {
		new TestsUseCase13().Prueba13_2(driver, mdb);
	}

	@Test
	public void Prueba13_3() {
		new TestsUseCase13().Prueba13_3(driver, mdb);
	}

	// #################### CASO DE USO 14 ####################
	@Test
	public void Prueba14_1() {
		new TestsUseCase14().Prueba14_1(driver, mdb);
	}

	@Test
	public void Prueba14_2() {
		new TestsUseCase14().Prueba14_2(driver, mdb);
	}

	@Test
	public void Prueba14_3() {
		new TestsUseCase14().Prueba14_3(driver, mdb);
	}

	// #################### CASO DE USO 15 ####################
	@Test
	public void Prueba15() {
		new TestsUseCase15().Prueba15(driver, mdb);
	}

	// #################### CASO DE USO 16 ####################
	@Test
	public void Prueba16() {
		new TestsUseCase16().Prueba16(driver, mdb);
	}

	// #################### CASO DE USO 17 ####################
	@Test
	public void Prueba17() {
		new TestsUseCase17().Prueba17(driver, mdb);
	}

	@Test
	public void PruebaN17() {
		new TestsUseCase17().PruebaN17(driver, mdb);
	}

	// #################### CASO DE USO 18 ####################
	@Test
	public void Prueba18() {
		new TestsUseCase18().Prueba18(driver, mdb);
	}

	// #################### CASO DE USO 19 ####################
	@Test
	public void Prueba19() {
		new TestsUseCase19().Prueba19(driver, mdb);
	}

	@Test
	public void PruebaN19() {
		new TestsUseCase19().PruebaN19(driver, mdb);
	}

	// #################### CASO DE USO 20 ####################
	@Test
	public void Prueba20() {
		new TestsUseCase20().Prueba20(driver, mdb);
	}

	// #################### CASO DE USO 21 ####################
	@Test
	public void Prueba21() {
		new TestsUseCase21().Prueba21(driver, mdb);
	}

	// #################### CASO DE USO 22 ####################
	@Test
	public void Prueba22() {
		new TestsUseCase22().Prueba22(driver, mdb);
	}

	// #################### CASO DE USO 23 ####################
	@Test
	public void Prueba23() {
		new TestsUseCase23().Prueba23(driver, mdb);
	}
	
	// #################### CASO DE USO 24 ####################
	@Test
	public void Prueba24() {
		new TestsUseCase24().Prueba24(driver, mdb);
	}

	public void insertData() {
		// ########## LOGGER ##########
		mdb.dropCollection("logger");

		// ########## OWNERS ##########
		Document owner = new Document("name", "Propietario 1").append("surname", "Apellido Propietario 1")
				.append("dni", "00000000A").append("phone", 666666666).append("email", "propietario1@propietario.com")
				.append("address", "Direccion Propietario 1");
		mdb.insert("owners", owner);

		// ########## PROPERTIES ##########
		Document property1 = new Document("type", "vivienda").append("code", "VP01").append("typeOp", "Venta")
				.append("name", "Vivienda 1").append("address", "Calle Vivienda 1").append("floor", 3)
				.append("description", "Descripcion Vivienda 1").append("city", "Ciudad Vivienda 1").append("area", 100)
				.append("numHabs", 2).append("numBan", 1).append("price", 1000).append("priceCom", 100)
				.append("garaje", true).append("piscina", false).append("terraza", true).append("trastero", false)
				.append("jardin", true).append("ascensor", false).append("calefaccion", true).append("aireAcon", false)
				.append("amueblado", true).append("animales", false).append("media", new ArrayList<String>())
				.append("owner", owner.getObjectId("_id"));
		Document property2 = new Document("type", "local").append("code", "LP01").append("typeOp", "Venta")
				.append("name", "Local 1").append("address", "Calle Local 1").append("floor", 3)
				.append("description", "Descripcion Local 1").append("city", "Ciudad Local 1").append("area", 500)
				.append("numAseos", 2).append("price", 1000).append("priceCom", 100).append("escaparate", true)
				.append("aparcamiento", false).append("cargaYdescarga", true).append("extintores", false)
				.append("iluminacion", true).append("calefaccion", false).append("aireAcon", true)
				.append("media", new ArrayList<String>()).append("owner", owner.getObjectId("_id"));
		Document property3 = new Document("type", "suelo").append("code", "SP01").append("typeOp", "Alquiler")
				.append("name", "Suelo 1").append("description", "Descripcion Suelo 1").append("city", "Ciudad Suelo 1")
				.append("situation", "Situacion Suelo 1").append("area", 500).append("edifArea", 250)
				.append("price", 10000).append("accesoAgua", true).append("accesoLuz", false)
				.append("media", new ArrayList<String>()).append("owner", owner.getObjectId("_id"));
		Document property4 = new Document("type", "vivienda").append("code", "VP02").append("typeOp", "Alquiler")
				.append("name", "Vivienda 2").append("address", "Calle Vivienda 2").append("floor", 4)
				.append("description", "Descripcion Vivienda 2").append("city", "Ciudad Vivienda 2").append("area", 100)
				.append("numHabs", 3).append("numBan", 2).append("price", 1600).append("priceCom", 150)
				.append("garaje", false).append("piscina", true).append("terraza", false).append("trastero", true)
				.append("jardin", false).append("ascensor", true).append("calefaccion", false).append("aireAcon", true)
				.append("amueblado", false).append("animales", true).append("media", new ArrayList<String>())
				.append("owner", owner.getObjectId("_id"));
		Document property5 = new Document("type", "local").append("code", "LP02").append("typeOp", "Alquiler")
				.append("name", "Local 2").append("address", "Calle Local 2").append("floor", 4)
				.append("description", "Descripcion Local 2").append("city", "Ciudad Local 2").append("area", 550)
				.append("numAseos", 1).append("price", 1200).append("priceCom", 80).append("escaparate", false)
				.append("aparcamiento", true).append("cargaYdescarga", false).append("extintores", true)
				.append("iluminacion", false).append("calefaccion", true).append("aireAcon", false)
				.append("media", new ArrayList<String>()).append("owner", owner.getObjectId("_id"));
		Document property6 = new Document("type", "suelo").append("code", "SP02").append("typeOp", "Venta")
				.append("name", "Suelo 2").append("description", "Descripcion Suelo 2").append("city", "Ciudad Suelo 2")
				.append("situation", "Situacion Suelo 2").append("area", 700).append("edifArea", 300)
				.append("price", 15000).append("accesoAgua", false).append("accesoLuz", true)
				.append("media", new ArrayList<String>()).append("owner", owner.getObjectId("_id"));

		mdb.insert("properties", property1);
		mdb.insert("properties", property2);
		mdb.insert("properties", property3);
		mdb.insert("properties", property4);
		mdb.insert("properties", property5);
		mdb.insert("properties", property6);

		// ########## USERS ##########
		Document superagente = new Document("name", "SuperAgente").append("surname", "SuperAgentito")
				.append("email", "superagente@superagente.com").append("permission", "S")
				.append("password", "c45bbb35d6d56f860eb7b8b6ab21a95cd06bf233a79cac2a7b07f779198e7f33")
				.append("active", true);
		Document agente1 = new Document("name", "Agente1").append("surname", "Agentito1")
				.append("email", "agente1@agente.com").append("permission", "A")
				.append("password", "c45bbb35d6d56f860eb7b8b6ab21a95cd06bf233a79cac2a7b07f779198e7f33")
				.append("active", true);
		Document agente2 = new Document("name", "Agente2").append("surname", "Agentito2")
				.append("email", "agente2@agente.com").append("permission", "A")
				.append("password", "c45bbb35d6d56f860eb7b8b6ab21a95cd06bf233a79cac2a7b07f779198e7f33")
				.append("active", true);

		Document codes = new Document("emailActivation", "").append("passwordRecover", "");
		ArrayList<String> wishes = new ArrayList<String>();
		wishes.add(property1.getObjectId("_id").toString());
		Document usuario1 = new Document("name", "Usuario1").append("surname", "Usuarito1")
				.append("email", "usuario1@usuario.com").append("permission", "U")
				.append("password", "c45bbb35d6d56f860eb7b8b6ab21a95cd06bf233a79cac2a7b07f779198e7f33")
				.append("active", true).append("wishes", wishes).append("codes", codes);
		Document usuario2 = new Document("name", "Usuario2").append("surname", "Usuarito2")
				.append("email", "usuario2@usuario.com").append("permission", "U")
				.append("password", "c45bbb35d6d56f860eb7b8b6ab21a95cd06bf233a79cac2a7b07f779198e7f33")
				.append("active", false).append("wishes", wishes).append("codes", codes);

		mdb.insert("users", superagente);
		mdb.insert("users", agente1);
		mdb.insert("users", agente2);
		mdb.insert("users", usuario1);
		mdb.insert("users", usuario2);

		// ########## CONVERSATIONS ##########
		Document message = new Document("from", "U").append("text", "General Kenobi").append("date", "24,04")
				.append("time", "22:44").append("seen", false);
		ArrayList<Document> lista = new ArrayList<>();
		lista.add(message);
		Document conversation = new Document("messages", lista).append("user", usuario1.getObjectId("_id"))
				.append("agent", agente1.getObjectId("_id")).append("property", property1.getObjectId("_id"));

		mdb.insert("conversations", conversation);

		// ########## INFO ##########
		Document info = new Document("phones", "985 470 012, 666 666 666")
				.append("emails", "info@arca-agenciainmobiliaria.com, arca@agenciainmobiliaria.com")
				.append("active", true);
		mdb.insert("info", info);
	}

}