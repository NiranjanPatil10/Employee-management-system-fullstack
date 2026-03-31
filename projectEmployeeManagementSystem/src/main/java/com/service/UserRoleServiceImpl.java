package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dao.RoleRepository;
import com.dao.UserRepository;
import com.dao.UserRoleRepository;
import com.exception.ResourceNotFoundException;
import com.model.Role;
import com.model.User;
import com.model.UserRole;



@Service
public class UserRoleServiceImpl implements UserRoleService {

	@Autowired
	private UserRepository userRepo;
	
	
	@Autowired
	private RoleRepository roleRepo;
	
	
	
	@Autowired
	private UserRoleRepository userroleRepo;
	
	
	
	
	@Override
	public UserRole assignRoleToUser(Long userId, Long roleId) {
		
		
       User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

	   Role role = roleRepo.findById(roleId).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
		
		
	   UserRole userRole = new UserRole();
       userRole.setUser(user);
       userRole.setRole(role);

         return userroleRepo.save(userRole);
       
       
	}

	
	
	
	@Override
	public List<UserRole> getRolesByUser(Long userId) {

 
		
		User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
		
		return userroleRepo.findByUser(user);
	}




	@Override
	public boolean isAdmin(Long userId) {


		 User user = userRepo.findById(userId)
		            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
		 
		 
		 List<UserRole> roles = userroleRepo.findByUser(user);
		
		 
		return roles.stream().anyMatch(r -> r.getRole().getName().equals("ADMIN"));
	}

}
