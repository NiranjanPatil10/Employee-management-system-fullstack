package com.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.User;
import com.model.UserRole;



public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
	
	
	 List<UserRole> findByUser(User user);

}
