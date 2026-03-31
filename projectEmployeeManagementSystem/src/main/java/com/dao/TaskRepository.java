package com.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.Task;
import com.model.User;



public interface TaskRepository extends JpaRepository<Task, Long> {
	
	List<Task> findByUser(User user);

}
