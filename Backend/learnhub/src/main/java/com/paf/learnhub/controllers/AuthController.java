package com.paf.learnhub.controllers;

import com.paf.learnhub.models.User;
import com.paf.learnhub.Services.UserService;
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
    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(new HashMap<>());
        }
        
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String provider = principal.getAttribute("provider");
        
        User user = userService.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setProvider(provider);
            user = userService.saveUser(user);
        }
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("provider", user.getProvider());
        
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/login/oauth2/code/{provider}")
    public ResponseEntity<?> oauth2Callback(@PathVariable String provider, @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.badRequest().body("Authentication failed");
        }
        
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        
        User user = userService.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setProvider(provider);
            user = userService.saveUser(user);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("redirectUrl", "http://localhost:5173/home");
        
        return ResponseEntity.ok(response);
    }

    // Add email/password login with JWT (implementation omitted for brevity)
}