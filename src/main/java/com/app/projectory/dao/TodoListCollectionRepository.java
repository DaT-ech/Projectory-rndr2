package com.app.projectory.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.app.projectory.entity.TodoListCollection;

@Repository
public interface TodoListCollectionRepository extends CrudRepository<TodoListCollection, Long> {
	@Query(nativeQuery = true, value ="SELECT * FROM todo_list_collection WHERE user_id = ?1 ORDER BY todo_collection_id DESC")
	List<TodoListCollection> findTodoCollectionByUserId(long userId);
	
	@Transactional
	@Modifying
	@Query(value="DELETE FROM todo_list_collection WHERE todo_collection_id = ?1 AND user_id = ?2", nativeQuery = true)
	int deleteUserCollection(long collectionId, long userId);
	
	
	
	
	
}
