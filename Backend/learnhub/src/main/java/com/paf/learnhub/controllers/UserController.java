package com.paf.learnhub.controllers;

import com.paf.learnhub.models.User;

import ch.qos.logback.classic.Logger;

import com.paf.learnhub.Services.UserService;

import java.util.List;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = (Logger) LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        logger.info("Register request for email: {}", user.getEmail());
        try {
            User registeredUser = userService.register(user.getName(), user.getEmail(), user.getPassword());
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            logger.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.login(user.getEmail(), user.getPassword());
    }

    @GetMapping("/oauth-callback")
    public ResponseEntity<?> oauthCallback(OAuth2AuthenticationToken token) {
        if (token == null) {
            logger.error("OAuth token is null in callback");
            return ResponseEntity.badRequest().body("OAuth authentication failed: No token provided");
        }
        logger.info("OAuth callback received");
        User user = userService.handleOAuthLogin(token);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User user) {
        return userService.updateUser(id, user.getName(), user.getEmail());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        return userService.findById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/oauth-failure")
    public ResponseEntity<String> oauthFailure() {
        return ResponseEntity.badRequest().body("OAuth login failed");
    }

    @GetMapping("/registered")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }



}