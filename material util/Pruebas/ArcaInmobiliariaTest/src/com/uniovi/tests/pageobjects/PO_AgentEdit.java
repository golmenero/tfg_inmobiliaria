package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_AgentEdit extends PO_NavView {

	static public void fillForm(WebDriver driver, String namep, String surnamep, String emailp, String passwordp) {
		WebElement name = driver.findElement(By.name("name"));
		name.click();
		name.clear();
		name.sendKeys(namep);
		WebElement surname = driver.findElement(By.name("surname"));
		surname.click();
		surname.clear();
		surname.sendKeys(surnamep);
		WebElement email = driver.findElement(By.name("email"));
		email.click();
		email.clear();
		email.sendKeys(emailp);
		
		WebElement password = driver.findElement(By.id("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		
		driver.findElement(By.id("confirmEditAgent")).click();
	}
}
