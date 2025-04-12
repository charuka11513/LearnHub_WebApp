package com.paf.learnhub.controllers;
/* 
import com.paf.learnhub.models.User;
import com.paf.learnhub.Services.UserService;
import com.paf.learnhub.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            logger.info("Register attempt with body: {}", body);
            String email = body.get("email");
            String name = body.get("name");
            String password = body.get("password");

            if (email == null || email.isEmpty()) {
                logger.warn("Email is missing or empty");
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (name == null || name.isEmpty()) {
                logger.warn("Name is missing or empty");
                return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
            }
            if (password == null || password.isEmpty()) {
                logger.warn("Password is missing or empty");
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }

            logger.debug("Checking for existing user with email: {}", email);
            User existingUser = userService.findByEmail(email);
            if (existingUser != null) {
                logger.warn("Email already registered: {}", email);
                return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
            }

            User user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword(password);
            user.setProvider("email");
            logger.debug("Creating user: email={}, name={}, provider={}", email, name, user.getProvider());
            User savedUser = userService.saveUser(user);
            logger.info("User registered: id={}, email={}", savedUser.getId(), savedUser.getEmail());

            if (savedUser.getId() == null) {
                logger.error("Failed to save user: ID is null for email: {}", email);
                return ResponseEntity.status(500).body(Map.of("error", "Failed to register", "details", "User ID not generated"));
            }

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", savedUser.getId());
            userInfo.put("name", savedUser.getName());
            userInfo.put("email", savedUser.getEmail());
            userInfo.put("provider", savedUser.getProvider());

            logger.debug("Registration response: {}", userInfo);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            logger.error("Registration error for email {}: {}", body.get("email"), e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed", "details", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            logger.info("Login attempt with body: {}", body);
            String email = body.get("email");
            String password = body.get("password");

            if (email == null || email.isEmpty()) {
                logger.warn("Step 1: Email is missing or empty");
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (password == null || password.isEmpty()) {
                logger.warn("Step 2: Password is missing or empty");
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }

            logger.debug("Step 3: Fetching user for email: {}", email);
            User user = userService.findByEmail(email);
            if (user == null) {
                logger.warn("Step 4: User not found for email: {}", email);
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
            }

            logger.debug("Step 5: User found: id={}, email={}, name={}, provider={}", 
                        user.getId(), user.getEmail(), user.getName(), user.getProvider());
            logger.debug("Step 6: Verifying password for user: {}", email);
            boolean passwordVerified = userService.verifyPassword(email, password);
            logger.debug("Step 7: Password verification result for {}: {}", email, passwordVerified);
            if (!passwordVerified) {
                logger.warn("Step 8: Password verification failed for email: {}", email);
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
            }

            if (user.getId() == null) {
                logger.error("Step 9: User ID is null for email: {}", email);
                return ResponseEntity.status(500).body(Map.of("error", "Failed to login", "details", "User ID not available"));
            }

            logger.debug("Step 10: Generating JWT for user: {}", email);
            String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getName());
            logger.info("Step 12: JWT generated for user: {}", user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("provider", user.getProvider());
            response.put("token", token);

            logger.debug("Step 13: Login response prepared: id={}, email={}", user.getId(), user.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Step 14: Login error for email {}: {}", body.get("email"), e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Login failed", "details", e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User principal,
                                    @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            logger.info("Step U1: Fetching user, authHeader: {}, principal: {}", authHeader, principal != null ? "present" : "null");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                logger.debug("Step U2: Processing JWT: {}", token);
                if (!jwtUtil.isTokenValid(token)) {
                    logger.warn("Step U3: Invalid or expired token");
                    return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
                }
                String userId = jwtUtil.extractUserId(token);
                logger.debug("Step U4: Extracted userId: {}", userId);
                User user = userService.findById(userId);
                if (user == null) {
                    logger.warn("Step U5: User not found for id: {}", userId);
                    return ResponseEntity.status(404).body(Map.of("error", "User not found"));
                }
                logger.info("Step U6: User found for JWT: {}", user.getEmail());
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("name", user.getName());
                userInfo.put("email", user.getEmail());
                userInfo.put("provider", user.getProvider());
                logger.debug("Step U7: Returning user info: {}", userInfo);
                return ResponseEntity.ok(userInfo);
            }

            if (principal != null) {
                String email = principal.getAttribute("email");
                if (email == null) {
                    logger.error("Step U8: OAuth principal missing email");
                    return ResponseEntity.status(400).body(Map.of("error", "OAuth user email missing"));
                }
                logger.debug("Step U9: Processing OAuth user: {}", email);
                String name = principal.getAttribute("name");
                String provider = principal.getAttribute("provider");

                User user = userService.findByEmail(email);
                if (user == null) {
                    user = new User();
                    user.setEmail(email);
                    user.setName(name != null ? name : "OAuth User");
                    user.setProvider(provider != null ? provider : "unknown");
                    logger.debug("Step U10: Creating new OAuth user: {}", email);
                    user = userService.saveUser(user);
                    logger.info("Step U11: Created OAuth user: {}", email);
                }
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("name", user.getName());
                userInfo.put("email", user.getEmail());
                userInfo.put("provider", user.getProvider());
                logger.debug("Step U12: Returning OAuth user info: {}", userInfo);
                return ResponseEntity.ok(userInfo);
            }

            logger.info("Step U13: No JWT or OAuth principal provided");
            return ResponseEntity.ok(new HashMap<>());
        } catch (Exception e) {
            logger.error("Step U14: Error fetching user: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user", "details", e.getMessage()));
        }
    }

    @GetMapping("/login/oauth2/code/{provider}")
    public ResponseEntity<?> oauth2Callback(@PathVariable String provider, @AuthenticationPrincipal OAuth2User principal) {
        try {
            logger.info("OAuth callback for provider: {}", provider);
            if (principal == null) {
                logger.error("OAuth callback with null principal");
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication failed"));
            }

            String email = principal.getAttribute("email");
            if (email == null) {
                logger.error("OAuth callback missing email");
                return ResponseEntity.badRequest().body(Map.of("error", "OAuth user email missing"));
            }

            String name = principal.getAttribute("name");
            User user = userService.findByEmail(email);
            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setName(name != null ? name : "OAuth User");
                user.setProvider(provider);
                user = userService.saveUser(user);
                logger.info("Created OAuth user: {}", email);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("redirectUrl", "http://localhost:5173/home");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("OAuth callback error for provider {}: {}", provider, e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "OAuth authentication failed", "details", e.getMessage()));
        }
    }

}*/