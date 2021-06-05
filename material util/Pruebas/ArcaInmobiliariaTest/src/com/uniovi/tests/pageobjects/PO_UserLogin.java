package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;



public class PO_UserLogin extends PO_NavView {

	static public void fillForm(WebDriver driver, String emailp, String passwordp) {
		WebElement dni = driver.findElement(By.name("email"));
		dni.click();
		dni.clear();
		dni.sendKeys(emailp);
		WebElement password = driver.findElement(By.id("passwordR"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		
		driver.findElement(By.id("btnLogin")).click();
	}
}
