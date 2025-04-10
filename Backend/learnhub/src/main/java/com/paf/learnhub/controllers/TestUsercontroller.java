package com.paf.learnhub.controllers;

import com.paf.learnhub.models.TestUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
//import java.util.UUID;  autogenaret id

@RestController
@RequestMapping("/api/test")
public class TestUsercontroller {

    @Autowired
    private MongoTemplate mongoTemplate;

    // CREATE: Add a new user
    @PostMapping
    public ResponseEntity<TestUser> createUser(@RequestBody TestUser user) {
        try {
            /*if (user.getId() == null) {
                user.setId(UUID.randomUUID().toString()); // Generate ID if not provided
            }*/
            TestUser createdUser = mongoTemplate.save(user, "test"); // Save to "test_users" collection
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED); // 201 Created
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    // READ: Get a user by ID
    @GetMapping("/{id}")
    public ResponseEntity<TestUser> getUserById(@PathVariable String id) {
        Query query = new Query(Criteria.where("id").is(id));
        TestUser user = mongoTemplate.findOne(query, TestUser.class, "test");
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK); // 200 OK
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }

    // READ: Get all users
    @GetMapping
    public ResponseEntity<List<TestUser>> getAllUsers() {
        try {
            List<TestUser> users = mongoTemplate.findAll(TestUser.class, "test");
            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
            }
            return new ResponseEntity<>(users, HttpStatus.OK); // 200 OK
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    } 

    // UPDATE: Update an existing user by ID
    @PutMapping("/{id}")
    public ResponseEntity<TestUser> updateUser(@PathVariable String id, @RequestBody TestUser user) {
        Query query = new Query(Criteria.where("id").is(id));
        TestUser existingUser = mongoTemplate.findOne(query, TestUser.class, "test");
        if (existingUser != null) {
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            TestUser updatedUser = mongoTemplate.save(existingUser, "test");
            return new ResponseEntity<>(updatedUser, HttpStatus.OK); // 200 OK
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }

    // DELETE: Delete a user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        Query query = new Query(Criteria.where("id").is(id));
        TestUser user = mongoTemplate.findOne(query, TestUser.class, "test");
        if (user != null) {
            mongoTemplate.remove(user, "test");
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }
}