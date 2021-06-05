package com.uniovi.tests.util;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class MongoDBUtils {
	static String URLLocalMongo = "mongodb://127.0.0.1:27017";
	
	MongoDatabase db;

	public MongoDBUtils() {
		MongoClient mongoClient = MongoClients.create(URLLocalMongo);
		this.db =  mongoClient.getDatabase("tfginmobiliaria");
		clearDataBase();
	}
	
	public void insert(String collection, Document object){
		MongoCollection<Document> myCollection = db.getCollection(collection);
		myCollection.insertOne(object);
	}
	
	public void dropCollection(String collection) {
		MongoCollection<Document> myCollection = db.getCollection(collection);
		myCollection.drop();
	}
	
	public Document getOne(String collection, Document condition) {
		MongoCollection<Document> myCollection = db.getCollection(collection);
		return myCollection.find(condition).first();
	}
	
	public void exists(String collection, Document condition) {
		MongoCollection<Document> myCollection = db.getCollection(collection);
		assertNotNull(myCollection.find(condition).first());
	}
	
	public void doesNotExist(String collection, Document condition) {
		MongoCollection<Document> myCollection = db.getCollection(collection);
		assertNull(myCollection.find(condition).first());
	}
	
	public void clearDataBase() {
		MongoCollection<Document> collection = db.getCollection("users");
		collection.drop();
		collection = db.getCollection("users");
		collection.drop();
		collection = db.getCollection("conversations");
		collection.drop();
		collection = db.getCollection("info");
		collection.drop();
		collection = db.getCollection("logger");
		collection.drop();
		collection = db.getCollection("owners");
		collection.drop();
		collection = db.getCollection("properties");
		collection.drop();
		
		
	}
}
