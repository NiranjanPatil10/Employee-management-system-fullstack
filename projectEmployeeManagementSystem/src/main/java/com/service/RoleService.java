package com.service;

import java.util.List;

import com.model.Role;

public interface RoleService {

	
	
	    Role createRole(Role role);

	    List<Role> getAllRoles();

	    Role getRoleById(Long id);
	    
	    Role getRoleByName(String name);
	
}
