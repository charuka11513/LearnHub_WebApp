package com.paf.learnhub.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "posts")
@Data
public class Post {
    @Id
    private String id;
    private String userId; // Reference to the user who created the post
    private String description;
    private String photoUrl; // URL to the uploaded photo
    private String videoUrl; // URL to the uploaded video
    private LocalDateTime createdAt;
    private List<String> likes; // List of user IDs who liked the post
}