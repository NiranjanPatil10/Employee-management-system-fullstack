package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan({"com.example.demo", "com.controller","com.exception", "com.dao", "com.model", "com.service"})
@EntityScan("com.model")
@EnableJpaRepositories(basePackages="com")
public class ProjectUserManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectUserManagementSystemApplication.class, args);
	}

}
