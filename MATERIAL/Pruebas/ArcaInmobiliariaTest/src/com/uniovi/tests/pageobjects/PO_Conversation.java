package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_Conversation extends PO_NavView {

	static public void fillForm(WebDriver driver, String messagep) {
		WebElement message = driver.findElement(By.name("messageInput"));
		message.click();
		message.clear();
		message.sendKeys(messagep);
		
		driver.findElement(By.id("btnEnviarMensaje")).click();
	}
}
