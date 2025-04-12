package com.paf.learnhub.controllers;

import com.paf.learnhub.models.User;
import com.paf.learnhub.Services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        logger.info("Register request: email={}", user.getEmail());
        try {
            User registeredUser = userService.register(user.getName(), user.getEmail(), user.getPassword());
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            logger.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        logger.info("Login request: email={}", user.getEmail());
        try {
            User loggedInUser = userService.login(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(loggedInUser);
        } catch (Exception e) {
            logger.error("Login failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/oauth-callback")
    public ResponseEntity<?> oauthCallback(OAuth2AuthenticationToken token, HttpSession session) {
        logger.info("OAuth callback: session={}", session.getId());
        if (token == null) {
            logger.error("OAuth token null: session={}", session.getId());
            return ResponseEntity.badRequest().body("OAuth authentication failed: No token");
        }
        try {
            User user = userService.handleOAuthLogin(token);
            session.setAttribute("userId", user.getId());
            logger.info("OAuth user stored: id={}, email={}", user.getId(), user.getEmail());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("OAuth callback failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("OAuth failed: " + e.getMessage());
        }
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        logger.info("Current user request: session={}", session.getId());
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            logger.debug("No userId in session");
            return ResponseEntity.ok(null);
        }
        logger.info("Found userId: {}", userId);
        try {
            return userService.findById(userId)
                    .map(user -> {
                        logger.info("Returning user: email={}", user.getEmail());
                        return ResponseEntity.ok(user);
                    })
                    .orElseGet(() -> {
                        logger.warn("User not found: id={}", userId);
                        session.removeAttribute("userId");
                        return ResponseEntity.ok(null);
                    });
        } catch (Exception e) {
            logger.error("Error fetching user: id={}, error={}", userId, e.getMessage(), e);
            return ResponseEntity.ok(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User user) {
        logger.info("Update request: id={}", id);
        try {
            User updatedUser = userService.updateUser(id, user.getName(), user.getEmail());
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            logger.error("Update failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        logger.info("Fetch user: id={}", id);
        return userService.findById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElseGet(() -> {
                    logger.warn("User not found: id={}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/oauth-failure")
    public ResponseEntity<String> oauthFailure() {
        logger.error("OAuth login failed");
        return ResponseEntity.badRequest().body("OAuth login failed");
    }

    @GetMapping("/registered")
    public ResponseEntity<List<User>> getAllUsers() {
        logger.info("Fetching all users");
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/debug-session")
    public ResponseEntity<?> debugSession(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        logger.info("Debug session: id={}, userId={}", session.getId(), userId);
        return ResponseEntity.ok("Session ID: " + session.getId() + ", UserId: " + userId);
    }
}