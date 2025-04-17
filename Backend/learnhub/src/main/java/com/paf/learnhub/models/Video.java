package com.paf.learnhub.models;

import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "videos")
public class Video {
    @Id
    private String id;
    private String postId;
    private String userId;
    private String userName;
    private String title;
    private String description;
    private Binary videoData; // Store video as binary
    private Binary thumbnailData; // Store thumbnail as binary
    private String createdAt;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Binary getVideoData() { return videoData; }
    public void setVideoData(Binary videoData) { this.videoData = videoData; }
    public Binary getThumbnailData() { return thumbnailData; }
    public void setThumbnailData(Binary thumbnailData) { this.thumbnailData = thumbnailData; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}