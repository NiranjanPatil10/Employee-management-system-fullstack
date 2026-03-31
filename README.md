# Employee Management System

A scalable full-stack Employee Management System built using Spring Boot and React, designed to streamline employee operations with role-based access control and efficient task management.

---

## 🚀 Features

- Role-based access control (Admin & User)
- User registration and login system  
- Admin dashboard for centralized management  
- User dashboard for task tracking and profile management  
- Task assignment and status tracking system  
- RESTful API integration for real-time data handling  

---

## 🛠️ Tech Stack

### Backend
- Java  
- Spring Boot  
- Spring Data JPA (Hibernate)  
- REST APIs  
- MySQL  

### Frontend
- React.js  
- JavaScript  
- HTML  
- CSS  

### Tools
- Postman  
- Git & GitHub  

---

## 🏗️ System Architecture

Frontend (React) → Backend (Spring Boot APIs) → Database (MySQL)

---

## 🔐 Role-Based Access Control

### 🛡️ Admin Capabilities
- View all registered users  
- Update and delete users  
- Assign roles to users  
- Assign tasks to users  
- Delete tasks  
- Monitor overall system data  

### 👤 User Capabilities
- Login and access personal dashboard  
- View assigned tasks  
- Update task status 
- Update personal profile information  
- Change password  

---

## 📌 API Endpoints

### User APIs
- `POST /users/register`  
- `POST /users/login`  
- `GET /users/{id}`  
- `PUT /users/update/{id}`  
- `PUT /users/changePassword/{id}`  
- `GET /users/getAll/{adminId}`  
- `DELETE /users/{id}/{adminId}`  

### Task APIs
- `POST /tasks/assign/{userId}/{adminId}`  
- `GET /tasks/user/{userId}`  
- `PUT /tasks/{taskId}/status`  
- `DELETE /tasks/{taskId}`  

### Role APIs
- `POST /roles/create`  
- `GET /roles/all`  
- `GET /roles/{id}`  
- `GET /roles/name/{name}`  

### User-Role APIs
- `POST /user-roles/assign?userId=&roleId=&adminId=`  
- `GET /user-roles/user/{userId}` 
---


## ⚙️ Setup Instructions

### Backend
1. Clone the repository  
2. Configure MySQL in `application.properties`  
3. Run the Spring Boot application  

### Frontend
1. Navigate to frontend folder  
2. Run `npm install`  
3. Start using `npm run dev`  

### Access
- Frontend: http://localhost:5173  
- Backend: http://localhost:8090  

---

## 💡 Key Highlights

- Clean layered architecture (Controller → Service → Repository)  
- Efficient database handling using JPA/Hibernate  
- Structured exception handling  
- Role-based authorization  
- Seamless frontend-backend integration  
