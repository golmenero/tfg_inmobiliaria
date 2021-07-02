package com.uniovi.tests.util;


import java.util.List;

import static org.junit.Assert.*;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SeleniumUtils {

	
	/**
	 * Aborta si el "texto" no está presente en la página actual
	 * @param driver: apuntando al navegador abierto actualmente.
	 * @param texto: texto a buscar
	 */
	static public void textoPresentePagina(WebDriver driver, String texto)
	{
		List<WebElement> list = driver.findElements(By.xpath("//*[contains(text(),'" + texto + "')]"));		
		assertTrue("Texto " + texto + " no localizado!", list.size() > 0);			
	}

	/**
	 * Aborta si el "texto" está presente en la página actual
	 * @param driver: apuntando al navegador abierto actualmente.
	 * @param texto: texto a buscar
	 */
	static public void textoNoPresentePagina(WebDriver driver, String criterio, String texto)
	{
		String busqueda;
		if (criterio.equals("id")) busqueda = "//*[contains(@id,'" + texto + "')]";
		else if (criterio.equals("class")) busqueda = "//*[contains(@class,'" + texto + "')]";
		else if (criterio.equals("text")) busqueda = "//*[contains(text(),'" + texto + "')]";
		else if (criterio.equals("free")) busqueda = texto;
		else busqueda = "//*[contains("+criterio+",'" + texto + "')]";

		List<WebElement> list = driver.findElements(By.xpath(busqueda));		
		assertTrue("Texto " + texto + " aun presente !", list.size() == 0);			
	}

	/**
	 * Aborta si el "texto" está presente en la página actual tras timeout segundos.
	 * @param driver: apuntando al navegador abierto actualmente.
	 * @param texto: texto a buscar
	 * @param timeout: el tiempo máximo que se esperará por la aparición del texto a buscar
	 */
	static public void EsperaCargaPaginaNoTexto(WebDriver driver, String texto, int timeout)
	{
		Boolean resultado = 
				(new WebDriverWait(driver, timeout)).until(ExpectedConditions.invisibilityOfElementLocated(By.xpath("//*[contains(text(),'" + texto + "')]")));

		assertTrue(resultado);	
	}


	/**
	 * Espera por la visibilidad de un elemento/s en la vista actualmente cargandose en driver. Para ello se empleará una consulta xpath.
	 * @param driver: apuntando al navegador abierto actualmente.
	 * @param xpath: consulta xpath.
	 * @param timeout: el tiempo máximo que se esperará por la aparición del elemento a buscar con xpath
	 * @return  Se retornará la lista de elementos resultantes de la búsqueda con xpath.
	 */
	static public List<WebElement> EsperaCargaPaginaxpath(WebDriver driver, String xpath, int timeout)
	{
		EsperaPantallaDeCarga(driver, timeout);
		WebElement resultado = 
				(new WebDriverWait(driver, timeout)).until(ExpectedConditions.visibilityOfElementLocated(By.xpath(xpath)));
		assertTrue(resultado != null);
		List<WebElement> elementos = driver.findElements(By.xpath(xpath));

		return elementos;					
	}

	/**
	 * Espera por la visibilidad de un elemento/s en la vista actualmente cargandose en driver. Para ello se empleará una consulta xpath 
	 * según varios criterios..
	 * 
	 * @param driver: apuntando al navegador abierto actualmente.
	 * @param criterio: "id" or "class" or "text" or "@attribute" or "free". Si el valor de criterio es free es una expresion xpath completa. 
	 * @param text: texto correspondiente al criterio.
	 * @param timeout: el tiempo máximo que se esperará por la apareción del elemento a buscar con criterio/text.
	 * @return Se retornará la lista de elementos resultantes de la búsqueda.
	 */
	static public List<WebElement> EsperaCargaPagina(WebDriver driver, String criterio, String text, int timeout)
	{
		String busqueda;
		if (criterio.equals("id")) busqueda = "//*[contains(@id,'" + text + "')]";
		else if (criterio.equals("class")) busqueda = "//*[contains(@class,'" + text + "')]";
		else if (criterio.equals("text")) busqueda = "//*[contains(text(),'" + text + "')]";
		else if (criterio.equals("free")) busqueda = text;
		else busqueda = "//*[contains("+criterio+",'" + text + "')]";

		return EsperaCargaPaginaxpath(driver, busqueda, timeout);
	}

	public static void EsperaPantallaDeCarga(WebDriver driver, int timeout) {
		Boolean resultado1 = (new WebDriverWait(driver, timeout)).until(ExpectedConditions.invisibilityOfElementLocated(By.xpath("//*[contains(@class,'loader-wrapper')]")));
		assertTrue(resultado1);
	}

}
