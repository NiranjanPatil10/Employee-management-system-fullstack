package com.service;

import java.util.List;

import com.model.UserRole;

public interface UserRoleService {
	
	
	
    UserRole assignRoleToUser(Long userId, Long roleId);

    List<UserRole> getRolesByUser(Long userId);
    
    boolean isAdmin(Long userId);

}
