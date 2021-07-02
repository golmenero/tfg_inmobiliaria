package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

public class PO_PropertyFilter extends PO_NavView {

	static private void fillFormCommon(WebDriver driver,  String typeOpp, String namep) {
		WebElement typeOp = driver.findElement(By.name("typeOp"));
		typeOp.click();
		Select selectTypeOp = new Select(typeOp);
		selectTypeOp.selectByValue(typeOpp);
		WebElement name = driver.findElement(By.name("name"));
		name.click();
		name.clear();
		name.sendKeys(namep);
	}

	static public void fillFormVivienda(WebDriver driver, String typeOpp, String namep, String addressp,
			String floorMinp, String floorMaxp, String cityp, String areaMaxp, String areaMinp, String numHabsp, String numBanp,
			String priceMinp, String priceMaxp, boolean garajep, boolean piscinap, boolean terrazap, boolean trasterop,
			boolean jardinp, boolean ascensorp, boolean calefaccionp, boolean aireaconp, boolean amuebladop,
			boolean animalesp) {

		// Rellenamos la primera pantalla
		fillFormCommon(driver,  typeOpp, namep);
		WebElement address = driver.findElement(By.name("address"));
		address.click();
		address.clear();
		address.sendKeys(addressp);
		WebElement city = driver.findElement(By.name("city"));
		city.click();
		city.clear();
		city.sendKeys(cityp);
		WebElement floor = driver.findElement(By.name("floorMin"));
		floor.click();
		floor.clear();
		floor.sendKeys(floorMinp);
		WebElement floorMax = driver.findElement(By.name("floorMax"));
		floorMax.click();
		floorMax.clear();
		floorMax.sendKeys(floorMaxp);
		WebElement area = driver.findElement(By.name("areaMin"));
		area.click();
		area.clear();
		area.sendKeys(areaMinp);
		WebElement areaMax = driver.findElement(By.name("areaMax"));
		areaMax.click();
		areaMax.clear();
		areaMax.sendKeys(areaMaxp);
		WebElement numHabs = driver.findElement(By.name("numHabs"));
		numHabs.click();
		Select selectNumHabs = new Select(numHabs);
		selectNumHabs.selectByValue(numHabsp);
		WebElement numBan = driver.findElement(By.name("numBan"));
		numBan.click();
		Select selectNumBan = new Select(numBan);
		selectNumBan.selectByValue(numBanp);
		WebElement price = driver.findElement(By.name("priceMin"));
		price.click();
		price.clear();
		price.sendKeys(priceMinp);
		WebElement priceMax = driver.findElement(By.name("priceMax"));
		priceMax.click();
		priceMax.clear();
		priceMax.sendKeys(priceMaxp);
		WebElement checkGaraje = driver.findElement(By.name("checkGaraje"));
		evaluateCheckBox(checkGaraje, garajep);
		WebElement checkPiscina = driver.findElement(By.name("checkPiscina"));
		evaluateCheckBox(checkPiscina, piscinap);
		WebElement checkTerraza = driver.findElement(By.name("checkTerraza"));
		evaluateCheckBox(checkTerraza, terrazap);
		WebElement checkTrastero = driver.findElement(By.name("checkTrastero"));
		evaluateCheckBox(checkTrastero, trasterop);
		WebElement checkJardin = driver.findElement(By.name("checkJardin"));
		evaluateCheckBox(checkJardin, jardinp);
		WebElement checkAscensor = driver.findElement(By.name("checkAscensor"));
		evaluateCheckBox(checkAscensor, ascensorp);
		WebElement checkCalefaccion = driver.findElement(By.name("checkCalefaccion"));
		evaluateCheckBox(checkCalefaccion, calefaccionp);
		WebElement checkAireAcon = driver.findElement(By.name("checkAireAcon"));
		evaluateCheckBox(checkAireAcon, aireaconp);
		WebElement checkAmueblado = driver.findElement(By.name("checkAmueblado"));
		evaluateCheckBox(checkAmueblado, amuebladop);
		WebElement checkAnimales = driver.findElement(By.name("checkAnimales"));
		evaluateCheckBox(checkAnimales, animalesp);

		// Pulsamos el boton de "Aplicar Filtros"
		driver.findElement(By.id("btnAplicarFiltros")).click();
	}

	static public void fillFormLocal(WebDriver driver, String typeOpp, String namep, String addressp,
			String cityp, String areaMinp, String areaMaxp, String floorMinp, String floorMaxp,
			String numAsp, String priceMinp, String priceMaxp,
			 boolean escaparatep, boolean aparcamientop, boolean cargaYdescargap, boolean extintoresp,
			boolean iluminacionp, boolean calefaccionp, boolean aireaconp) {
		fillFormCommon(driver, typeOpp, namep);
		WebElement address = driver.findElement(By.name("addressLoc"));
		address.click();
		address.clear();
		address.sendKeys(addressp);
		WebElement city = driver.findElement(By.name("cityLoc"));
		city.click();
		city.clear();
		city.sendKeys(cityp);
		WebElement area = driver.findElement(By.name("areaMinLoc"));
		area.click();
		area.clear();
		area.sendKeys(areaMinp);
		WebElement areaMax = driver.findElement(By.name("areaMaxLoc"));
		areaMax.click();
		areaMax.clear();
		areaMax.sendKeys(areaMaxp);
		WebElement floor = driver.findElement(By.name("floorMinLoc"));
		floor.click();
		floor.clear();
		floor.sendKeys(floorMinp);
		WebElement floorMax = driver.findElement(By.name("floorMaxLoc"));
		floorMax.click();
		floorMax.clear();
		floorMax.sendKeys(floorMaxp);
		WebElement numAs = driver.findElement(By.name("numAseosLoc"));
		numAs.click();
		Select selectNumBan = new Select(numAs);
		selectNumBan.selectByValue(numAsp);
		WebElement price = driver.findElement(By.name("priceMinLoc"));
		price.click();
		price.clear();
		price.sendKeys(priceMinp);
		WebElement priceMax = driver.findElement(By.name("priceMaxLoc"));
		priceMax.click();
		priceMax.clear();
		priceMax.sendKeys(priceMaxp);
		WebElement checkEscaparateLoc = driver.findElement(By.name("checkEscaparateLoc"));
		evaluateCheckBox(checkEscaparateLoc, escaparatep);
		WebElement checkAparcamientoLoc = driver.findElement(By.name("checkAparcamientoLoc"));
		evaluateCheckBox(checkAparcamientoLoc, aparcamientop);
		WebElement checkCargaYDescargaLoc = driver.findElement(By.name("checkCargaYDescargaLoc"));
		evaluateCheckBox(checkCargaYDescargaLoc, cargaYdescargap);
		WebElement checkExtintoresLoc = driver.findElement(By.name("checkExtintoresLoc"));
		evaluateCheckBox(checkExtintoresLoc, extintoresp);
		WebElement checkIluminacionLoc = driver.findElement(By.name("checkIluminacionLoc"));
		evaluateCheckBox(checkIluminacionLoc, iluminacionp);
		WebElement checkCalefaccionLoc = driver.findElement(By.name("checkCalefaccionLoc"));
		evaluateCheckBox(checkCalefaccionLoc, calefaccionp);
		WebElement checkAireAconLoc = driver.findElement(By.name("checkAireAconLoc"));
		evaluateCheckBox(checkAireAconLoc, aireaconp);

		// Pulsamos el boton de "Aplicar Filtros"
		driver.findElement(By.id("btnAplicarFiltros")).click();
	}
	
	static public void fillFormSuelo(WebDriver driver, String typeOpp, String namep, String cityp,
			String situationp, String priceMinp, String priceMaxp, String areaMaxp, String areaMinp,
			 String areaEdifMinSuep, String areaEdifMaxSuep,
			boolean accesoAguaSuep, boolean accesoLuzSuep ) {
		fillFormCommon(driver, typeOpp, namep);
		WebElement citySue = driver.findElement(By.name("citySue"));
		citySue.click();
		citySue.clear();
		citySue.sendKeys(cityp);
		WebElement situationSue = driver.findElement(By.name("situationSue"));
		situationSue.click();
		situationSue.clear();
		situationSue.sendKeys(situationp);
		WebElement price = driver.findElement(By.name("priceMinSue"));
		price.click();
		price.clear();
		price.sendKeys(priceMinp);
		WebElement priceMax = driver.findElement(By.name("priceMaxSue"));
		priceMax.click();
		priceMax.clear();
		priceMax.sendKeys(priceMaxp);
		WebElement areaMax = driver.findElement(By.name("areaMaxSue"));
		areaMax.click();
		areaMax.clear();
		areaMax.sendKeys(areaMaxp);
		WebElement areaMin = driver.findElement(By.name("areaMinSue"));
		areaMin.click();
		areaMin.clear();
		areaMin.sendKeys(areaMinp);
		WebElement areaEdifMinSue = driver.findElement(By.name("areaEdifMinSue"));
		areaEdifMinSue.click();
		areaEdifMinSue.clear();
		areaEdifMinSue.sendKeys(areaEdifMinSuep);
		WebElement areaEdifMaxSue = driver.findElement(By.name("areaEdifMaxSue"));
		areaEdifMaxSue.click();
		areaEdifMaxSue.clear();
		areaEdifMaxSue.sendKeys(areaEdifMaxSuep);
		
		
		WebElement accesoAguaSue = driver.findElement(By.name("checkAccesoAguaSue"));
		evaluateCheckBox(accesoAguaSue, accesoAguaSuep);
		WebElement accesoLuzSue = driver.findElement(By.name("checkAccesoLuzSue"));
		evaluateCheckBox(accesoLuzSue, accesoLuzSuep);

		// Pulsamos el boton de "Siguiente"
		driver.findElement(By.id("btnAplicarFiltros")).click();
	}

	static private void evaluateCheckBox(WebElement element, boolean value) {
		if (value)
			element.click();
	}

}
