package com.app.projectory.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.app.projectory.entity.Todo;

@Repository
public interface TodoListRepository extends CrudRepository<Todo, Long> {
	
	List<Todo> findAll();
	
	//@Query(nativeQuery = true, value="SELECT * from todo WHERE collection_id = ?1")
	//List<Todo> getTodoListByCollection(long collectionId);
	
	@Query(nativeQuery = true, value="SELECT * from todo WHERE collection_id = ?1")
	List<Todo> getTodoListByCollection(long collectionId);
	
	//@Query(nativeQuery = true, value="SELECT title from todo WHERE collection_id = ?1")
	//List<String> getTodoListByCollection(long collectionId);
	
	@Transactional
	@Modifying
	@Query(value="DELETE FROM todo where collection_id = ?1\n"
			+ "	AND \n"
			+ "	EXISTS(\n"
			+ "		SELECT 1 FROM todo_list_collection \n"
			+ "		WHERE todo_collection_id = ?1 AND user_id = ?2)", nativeQuery = true)
	int deleteAllListForCollection(long collectionId, long userId);
	
	@Transactional
	@Modifying
	@Query(value="DELETE FROM todo where collection_id = 4 AND todo_item_id = 16\n"
			+ "	AND \n"
			+ "	EXISTS(\n"
			+ "		SELECT 1 FROM todo_list_collection \n"
			+ "		WHERE todo_collection_id = 4 AND user_id = 7)", nativeQuery = true)
	int deleteOneListForCollection(long collectionId);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE todo SET status = 'done' WHERE todo_item_id = ?1", nativeQuery = true)
	int markItemDone(long itemId);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE todo SET status = null WHERE todo_item_id = ?1", nativeQuery = true)
	int markItemOngoing(long itemId);
}
