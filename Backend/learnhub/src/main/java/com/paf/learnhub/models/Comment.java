package com.paf.learnhub.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "comments")
@Data
public class Comment {
    @Id
    private String id;
    private String postId; // Reference to the post
    private String userId; // Reference to the user who commented
    private String content;
    private LocalDateTime createdAt;
}