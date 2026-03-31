package com.service;

import java.util.List;

import com.model.Task;
import com.model.User;

public interface TaskService {
	
	
    Task assignTaskToUser(Long userId, Task task);

    List<Task> getTasksByUser(User user);
    
    Task updateTaskStatus(Long taskId, String status);

    void deleteTask(Task taskId);

	

}
