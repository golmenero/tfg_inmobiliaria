package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_AgentRegister extends PO_NavView {

	static public void fillForm(WebDriver driver, String emailp, String namep, String lastnamep, String passwordp) {
		WebElement name = driver.findElement(By.name("name"));
		name.click();
		name.clear();
		name.sendKeys(namep);
		WebElement lastname = driver.findElement(By.name("surname"));
		lastname.click();
		lastname.clear();
		lastname.sendKeys(lastnamep);
		WebElement email = driver.findElement(By.name("email"));
		email.click();
		email.clear();
		email.sendKeys(emailp);
		WebElement password = driver.findElement(By.id("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		
		driver.findElement(By.id("confirmAgentSignin")).click();
	}
}
