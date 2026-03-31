package com.service;

import java.util.List;

import com.model.User;

public interface UserService {
	
	
	
	
	    User registerEmployee(User user);

	    User login(String email, String password);

	    User getProfile(Long userId);

	    User updateUser(Long userId, User updatedUser);

	    boolean changePassword(Long userId, String newPassword);

	    List<User> getAllEmployees();
	    
	    User getUserById(Long id);

	    void deleteEmployee(Long id);

}
