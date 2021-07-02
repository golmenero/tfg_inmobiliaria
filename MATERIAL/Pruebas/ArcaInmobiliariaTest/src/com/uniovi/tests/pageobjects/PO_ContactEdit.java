package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_ContactEdit extends PO_NavView {

	static public void fillForm(WebDriver driver, String phonesp, String emailsp) {
		WebElement phones = driver.findElement(By.name("phones"));
		phones.click();
		phones.clear();
		phones.sendKeys(phonesp);
		WebElement emails = driver.findElement(By.name("emails"));
		emails.click();
		emails.clear();
		emails.sendKeys(emailsp);
		
		driver.findElement(By.id("btnContactoGuardarCambios")).click();
	}
}
