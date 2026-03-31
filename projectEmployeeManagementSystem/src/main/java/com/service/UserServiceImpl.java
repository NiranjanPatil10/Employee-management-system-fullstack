package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dao.TaskRepository;
import com.dao.UserRepository;
import com.dao.UserRoleRepository;
import com.exception.DuplicateResourceException;
import com.exception.ResourceNotFoundException;
import com.model.User;




@Service
public class UserServiceImpl implements UserService {

	
	
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private UserRoleRepository userroleRepo;
	
	@Autowired
	private TaskRepository taskRepo;
	
	
	
	
	@Override
	public User registerEmployee(User user) {
		
		
		  if (userRepo.existsByEmail(user.getEmail())) {
			  throw new DuplicateResourceException("Email already exists");
			  
	        
		  }
	
		  
		return userRepo.save(user);
	}

	
	
	
	
	@Override
	public User login(String email, String password) {
		
    User user = userRepo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
		 
    
       if (!user.getPassword().equals(password)) {
        throw new ResourceNotFoundException("Invalid credentials");
        
            }
    
    
		 
                return user;
                
	}
	
	
	
	
	

	@Override
	public User getProfile(Long userId) {

		
		return userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

	
	
	
	
	@Override
	public User updateUser(Long userId, User updatedUser) {
		
		
		 User existing = getProfile(userId);
		 
		 existing.setName(updatedUser.getName());
		 existing.setEmail(updatedUser.getEmail());
		
		
		
		return userRepo.save(existing);
	}

	
	
	
	
	
	@Override
	public boolean changePassword(Long userId, String newPassword) {

	    User user = getProfile(userId);

	    user.setPassword(newPassword);
	    userRepo.save(user);

	    return true;
	}
	
	
	

	@Override
	public List<User> getAllEmployees() {
		
		
		return userRepo.findAll();
	}

	
	
	@Override
	public User getUserById(Long id) {
		
		return userRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("User not found by Id"));
	}



	
	
	
	@Override
	public void deleteEmployee(Long id) {

		   User user = getProfile(id);
		   
		   
		   
		   userroleRepo.deleteAll(userroleRepo.findByUser(user));

		  
		    taskRepo.deleteAll(taskRepo.findByUser(user));
		   
		   
	        userRepo.delete(user);
		
	}






}
