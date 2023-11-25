package com.app.projectory.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Todo {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)	
	private long todoItemId;	
	private String title;
	private String status;
	
	@JsonIgnore
	@ManyToOne(cascade= {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}, fetch = FetchType.LAZY)
	@JoinColumn(name="collection_id")
	private TodoListCollection collection;
	
	public Todo() {
		
	}
	public Todo(String title, String status) {
		this.title = title;
		this.status = status;
	}
	public long getTodoItemId() {
		return todoItemId;
	}
	public void setTodoItemId(long todoItemId) {
		this.todoItemId = todoItemId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public TodoListCollection getCollection() {
		return collection;
	}
	public void setCollection(TodoListCollection collection) {
		this.collection = collection;
	}
	@Override
	public String toString() {
		return "Todo [todoItemId=" + todoItemId + ", title=" + title + "]";
	}
	
	
	
}
