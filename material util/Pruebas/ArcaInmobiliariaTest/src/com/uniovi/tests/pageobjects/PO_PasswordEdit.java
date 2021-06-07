package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_PasswordEdit extends PO_NavView {

	static public void fillForm(WebDriver driver, String oldPasswordp, String passwordp) {
		WebElement oldPassword = driver.findElement(By.id("oldPassword"));
		oldPassword.click();
		oldPassword.clear();
		oldPassword.sendKeys(oldPasswordp);
		WebElement password = driver.findElement(By.id("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		WebElement passwordR = driver.findElement(By.id("passwordR"));
		passwordR.click();
		passwordR.clear();
		passwordR.sendKeys(passwordp);
		
		driver.findElement(By.id("confirmEditProfile")).click();
	}
}
