package com.app.projectory.controller;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.app.projectory.dao.TodoListCollectionRepository;
import com.app.projectory.dao.TodoListRepository;
import com.app.projectory.dao.UsersRepository;
import com.app.projectory.entity.Todo;
import com.app.projectory.entity.TodoListCollection;
import com.app.projectory.service.TodoListCollectionService;
import com.app.projectory.service.userAccountService;

@Controller
//@RequestMapping("todo-list-collection")
@RequestMapping("/user/collection")
public class TodoListCollectionController {
	
	@Autowired
	TodoListCollectionRepository collectionDao;
	@Autowired
	TodoListRepository todoRepo;
	@Autowired
	userAccountService userServ;
	@Autowired
	UsersRepository userRepo;
	@Autowired
	TodoListCollectionService collectionServ;
	
	
	@GetMapping
	public @ResponseBody List<TodoListCollection> serveCollection(Authentication auth) {
		long userId = userServ.getUserId(auth);
		return collectionServ.getTodoCollectionForCurrentUser(userId);		
	}
	
	//@GetMapping("/add-collection")
	@GetMapping("/create")
	@ResponseBody
	public int addTodoListCollection(@RequestParam String title, Authentication auth) {
//		Calendar d = Calendar.getInstance();
//		String currentToday = d.get(Calendar.DATE)+"/"+d.get(Calendar.MONTH+1)+"/"+d.get(Calendar.YEAR);
		
		if(!title.equals("") && title.length() <= 40) {
			LocalDateTime data = LocalDateTime.now(); 
			String authUsername = userServ.getCurrentUsername(auth);
			TodoListCollection collection = new TodoListCollection();
			collection.setCollectionTitle(title);
			collection.setCreator(userRepo.findByUsername(authUsername));
			collectionDao.save(collection);
			return 1;
		}
		return 0;
	}
	
	@GetMapping("/delete/{collection}")
	public @ResponseBody int deleteUserCollection(@PathVariable("collection") long collectionId, Authentication auth) {
		long userId = userServ.getUserId(auth);
		todoRepo.deleteAllListForCollection(collectionId, userId);
		return collectionDao.deleteUserCollection(collectionId, userId);
	
	
	}
	
	@GetMapping("/add/list")
	public @ResponseBody int addTodoListToCollection(@RequestParam String title, @RequestParam long collectionId, Authentication auth) {
		Todo todo = new Todo();
		try {			
			Optional<TodoListCollection> collection = collectionDao.findById(collectionId);
			collection.ifPresent(value -> todo.setCollection(value));
			
			todo.setTitle(title);
			todoRepo.save(todo);
		}
		catch(Exception er) {
			return -1;
		}
		return 1;
	}
	
	@GetMapping("/delete/list/item")
	public @ResponseBody int deleteTodoItem(@RequestParam long itemId) {
		todoRepo.deleteById(itemId);
		return 1;
		//return "redirect:/todo?item=deleted";
	}
//	@GetMapping("/delete/list/item/selected/{items}")
	@GetMapping("/delete/list/item/selected/")
	public @ResponseBody int deleteSelectedItems(@RequestParam("items") long[] selectedValues) {
	//public @ResponseBody int deleteSelectedItems(@RequestParam("items") List<Long> selectedValues) {
	//public @ResponseBody int deleteSelectedItems(@RequestParam("items") List<Long> selectedValues) {
		//String result = Arrays.toString(selectedValues);
		for(long i=0; i < selectedValues.length; i++ ) {
			todoRepo.deleteById(selectedValues[(int)i]);
		}
		
//		for(long i :  selectedValues) {
//			todoRepo.deleteById(i);
//		}
		return 1;
	}
	
	
	@GetMapping("/mark/done/{item}")
	public @ResponseBody int markTodoItemAsDone(@PathVariable("item") long itemId){
		return todoRepo.markItemDone(itemId);				
	}
	
	@GetMapping("/mark/ongoing/{item}")
	public @ResponseBody int markTodoItemAsOngoing(@PathVariable("item") long itemId){
		return todoRepo.markItemOngoing(itemId);				
	}	
	
	@GetMapping("/list")
	public @ResponseBody List<TodoListCollection> serveTodoList(Authentication auth) {
		long userId = userServ.getUserId(auth);
		return collectionServ.getTodoCollectionForCurrentUser(userId);		
	}
}
