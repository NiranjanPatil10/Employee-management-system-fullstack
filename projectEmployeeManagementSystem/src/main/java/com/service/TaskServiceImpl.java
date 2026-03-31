package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dao.TaskRepository;
import com.dao.UserRepository;
import com.exception.ResourceNotFoundException;
import com.model.Task;
import com.model.User;

@Service
public class TaskServiceImpl implements TaskService {

	
	
	@Autowired
	private TaskRepository taskRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	
	@Override
	public Task assignTaskToUser(Long userId, Task task) {
		
		
		User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

	      task.setUser(user);
		
		return taskRepo.save(task);
	}
	
	


	@Override
	public List<Task> getTasksByUser(User user) {
		
		return taskRepo.findByUser(user);
	}


	
	
	
	@Override
	public Task updateTaskStatus(Long taskId, String status) {
		
		Task task = taskRepo.findById(taskId).orElseThrow(()-> new ResourceNotFoundException("Task not found"));
		
		 task.setStatus(status);
		 
		return taskRepo.save(task);
	}

	





	@Override
	public void deleteTask(Task taskId) {
	
		
		taskRepo.delete(taskId);
		
	}





	
}
