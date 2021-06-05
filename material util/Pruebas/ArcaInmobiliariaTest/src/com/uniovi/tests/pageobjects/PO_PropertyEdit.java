package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

public class PO_PropertyEdit extends PO_NavView {

	static private void fillFormCommon(WebDriver driver, String codep, String typeOpp, String namep, 
			 String descriptionp, String cityp) {
		WebElement code = driver.findElement(By.name("code"));
		code.click();
		code.clear();
		code.sendKeys(codep);
		WebElement typeOp = driver.findElement(By.name("typeOp"));
		code.click();
		Select selectTypeOp = new Select(typeOp);
		selectTypeOp.selectByValue(typeOpp);
		WebElement name = driver.findElement(By.name("name"));
		name.click();
		name.clear();
		name.sendKeys(namep);
		WebElement description = driver.findElement(By.name("description"));
		description.click();
		description.clear();
		description.sendKeys(descriptionp);
		WebElement city = driver.findElement(By.name("city"));
		city.click();
		city.clear();
		city.sendKeys(cityp);
	}

	static public void fillFormVivienda(WebDriver driver, String codep, String typeOpp, String namep, String addressp,
			String floorp, String descriptionp, String cityp, String areap, String numHabsp, String numBanp,
			String pricep, String priceComp, boolean garajep, boolean piscinap, boolean terrazap, boolean trasterop,
			boolean jardinp, boolean ascensorp, boolean calefaccionp, boolean aireaconp, boolean amuebladop,
			boolean animalesp) {

		// Rellenamos la primera pantalla
		fillFormCommon(driver, codep, typeOpp, namep,   descriptionp, cityp);
		WebElement address = driver.findElement(By.name("address"));
		address.click();
		address.clear();
		address.sendKeys(addressp);
		WebElement floor = driver.findElement(By.name("floorV"));
		floor.click();
		floor.clear();
		floor.sendKeys(floorp);
		WebElement area = driver.findElement(By.name("area"));
		area.click();
		area.clear();
		area.sendKeys(areap);
		WebElement numHabs = driver.findElement(By.name("numHabs"));
		numHabs.click();
		Select selectNumHabs = new Select(numHabs);
		selectNumHabs.selectByValue(numHabsp);
		WebElement numBan = driver.findElement(By.name("numBan"));
		numBan.click();
		Select selectNumBan = new Select(numBan);
		selectNumBan.selectByValue(numBanp);
		WebElement price = driver.findElement(By.name("price"));
		price.click();
		price.clear();
		price.sendKeys(pricep);
		WebElement priceCom = driver.findElement(By.name("priceCom"));
		priceCom.click();
		priceCom.clear();
		priceCom.sendKeys(priceComp);
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

		// Pulsamos el boton de "Siguiente"
		driver.findElement(By.id("btnPropertiesS")).click();
	}

	static public void fillFormLocal(WebDriver driver, String codep, String typeOpp, String namep, String addressp,
			String floorp, String descriptionp, String cityp, String areap, String numAsp, String pricep, 
			String priceComp, boolean garajep, boolean aparcamientop, boolean cargaYdescargap, boolean extintoresp,
			boolean iluminacionp, boolean calefaccionp, boolean aireaconp) {
		fillFormCommon(driver, codep, typeOpp, namep, descriptionp, cityp);
		WebElement floor = driver.findElement(By.name("floorV"));
		floor.click();
		floor.clear();
		floor.sendKeys(floorp);
		WebElement address = driver.findElement(By.name("address"));
		address.click();
		address.clear();
		address.sendKeys(addressp);
		WebElement area = driver.findElement(By.name("areaLoc"));
		area.click();
		area.clear();
		area.sendKeys(areap);
		WebElement numAs = driver.findElement(By.name("numAsLoc"));
		numAs.click();
		Select selectNumBan = new Select(numAs);
		selectNumBan.selectByValue(numAsp);
		WebElement price = driver.findElement(By.name("priceLoc"));
		price.click();
		price.clear();
		price.sendKeys(pricep);
		WebElement priceCom = driver.findElement(By.name("priceComLoc"));
		priceCom.click();
		priceCom.clear();
		priceCom.sendKeys(priceComp);
		WebElement checkEscaparateLoc = driver.findElement(By.name("checkEscaparateLoc"));
		evaluateCheckBox(checkEscaparateLoc, garajep);
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

		// Pulsamos el boton de "Siguiente"
		driver.findElement(By.id("btnPropertiesS")).click();
	}
	
	static public void fillFormSuelo(WebDriver driver, String codep, String typeOpp, String namep,
			 String descriptionp, String cityp, String situationp, String areaSuep, String areaEdifSuep, 
			String priceSuep, boolean accesoAguaSuep, boolean accesoLuzSuep ) {
		fillFormCommon(driver, codep, typeOpp, namep, descriptionp, cityp);
		WebElement situationSue = driver.findElement(By.name("situationSue"));
		situationSue.click();
		situationSue.clear();
		situationSue.sendKeys(situationp);
		WebElement areaSue = driver.findElement(By.name("areaSue"));
		areaSue.click();
		areaSue.clear();
		areaSue.sendKeys(areaSuep);
		WebElement areaEdifSue = driver.findElement(By.name("areaEdifSue"));
		areaEdifSue.click();
		areaEdifSue.clear();
		areaEdifSue.sendKeys(areaEdifSuep);
		WebElement priceSue = driver.findElement(By.name("priceSue"));
		priceSue.click();
		priceSue.clear();
		priceSue.sendKeys(priceSuep);
		WebElement accesoAguaSue = driver.findElement(By.name("accesoAguaSue"));
		evaluateCheckBox(accesoAguaSue, accesoAguaSuep);
		WebElement accesoLuzSue = driver.findElement(By.name("accesoLuzSue"));
		evaluateCheckBox(accesoLuzSue, accesoLuzSuep);

		// Pulsamos el boton de "Siguiente"
		driver.findElement(By.id("btnPropertiesS")).click();
	}

	static public void fillFormOwner(WebDriver driver, String namep, String surnamep, String dnip, String phonep,
			String emailp, String addressp) {
		WebElement nameOwner = driver.findElement(By.name("nameOwner"));
		nameOwner.click();
		nameOwner.clear();
		nameOwner.sendKeys(namep);
		WebElement surnameOwner = driver.findElement(By.name("surnameOwner"));
		surnameOwner.click();
		surnameOwner.clear();
		surnameOwner.sendKeys(surnamep);
		WebElement dniOwner = driver.findElement(By.name("dniOwner"));
		dniOwner.click();
		dniOwner.clear();
		dniOwner.sendKeys(dnip);
		WebElement phoneOwner = driver.findElement(By.name("phoneOwner"));
		phoneOwner.click();
		phoneOwner.clear();
		phoneOwner.sendKeys(phonep);
		WebElement emailOwner = driver.findElement(By.name("emailOwner"));
		emailOwner.click();	
		emailOwner.clear();
		emailOwner.sendKeys(emailp);
		WebElement addressOwner = driver.findElement(By.name("addressOwner"));
		addressOwner.click();
		addressOwner.clear();
		addressOwner.sendKeys(addressp);

		// Pulsamos el boton de "Siguiente"
		driver.findElement(By.id("btnOwnerS")).click();
	}
	
	static public void confirmEditProperty(WebDriver driver) {
		WebElement addProperty = driver.findElement(By.id("btnOverwievS"));
		addProperty.click();
	}

	static private void evaluateCheckBox(WebElement element, boolean value) {
		if (value != element.isSelected())
			element.click();
	}

	public static void fillFormPictures(WebDriver driver, String path) {
		WebElement uploadElement = driver.findElement(By.id("imginmueble"));
		uploadElement.sendKeys(path);
		
		// Pulsamos el boton de "Siguiente"
		driver.findElement(By.id("btnPicturesS")).click();
	}
}
