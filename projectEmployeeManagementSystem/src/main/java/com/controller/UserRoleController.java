package com.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.model.UserRole;
import com.service.UserRoleService;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/user-roles")
public class UserRoleController {

	
    @Autowired
    private UserRoleService userRoleService;

    
    @PostMapping("/assign")
    public ResponseEntity<UserRole> assignRoleToUser(@RequestParam Long userId, @RequestParam Long roleId, @RequestParam Long adminId) {
    	
    	 if (!userRoleService.isAdmin(adminId)) {
    	        throw new RuntimeException("Access Denied");
    	    }

    	    return new ResponseEntity<>(userRoleService.assignRoleToUser(userId, roleId),HttpStatus.CREATED);
    }

    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserRole>> getRolesByUser(@PathVariable Long userId) {
        List<UserRole> roles = userRoleService.getRolesByUser(userId);
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }
}