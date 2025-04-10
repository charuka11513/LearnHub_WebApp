package com.paf.learnhub.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "videos")
@Data
public class Video {
    @Id
    private String id;
    private String postId; // Reference to the post
    private String userId; // Reference to the user who uploaded the video
    private String videoUrl; // URL to the video (e.g., S3 URL)
    private LocalDateTime uploadedAt;
}