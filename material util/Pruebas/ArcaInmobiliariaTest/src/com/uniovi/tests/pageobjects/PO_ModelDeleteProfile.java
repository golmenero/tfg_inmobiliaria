package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_ModelDeleteProfile extends PO_NavView{
	
	static public void fillForm(WebDriver driver, String passwordp) {
		WebElement password = driver.findElement(By.id("confirmPasswordDelete"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		
		driver.findElement(By.id("confirmDeleteProfile")).click();
	}
	
}
