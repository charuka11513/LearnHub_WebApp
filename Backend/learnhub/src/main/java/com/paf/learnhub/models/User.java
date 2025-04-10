package com.paf.learnhub.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password; // For email/password login (hashed)
    private String bio;
    private String provider; // "google", "github", or "email"
    private String providerId; // ID from OAuth provider
}