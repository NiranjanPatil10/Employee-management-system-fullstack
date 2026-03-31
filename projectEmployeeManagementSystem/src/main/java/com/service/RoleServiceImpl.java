package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dao.RoleRepository;
import com.exception.ResourceNotFoundException;
import com.model.Role;



@Service
public class RoleServiceImpl implements RoleService {

	
	@Autowired
	private RoleRepository roleRepo;
	
	
	@Override
	public Role createRole(Role role) {
		
		return roleRepo.save(role);
	}

	
	
	
	
	@Override
	public List<Role> getAllRoles() {
		
		return roleRepo.findAll();
	}

	
	
	
	@Override
	public Role getRoleById(Long id) {
	
		return roleRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Role not found"));
	}





	@Override
	public Role getRoleByName(String name) {
	
		return roleRepo.findByName(name).orElseThrow(()-> new ResourceNotFoundException("Role not found by Name"));
	}

}
