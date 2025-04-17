package com.paf.learnhub.controllers;

import com.paf.learnhub.models.Video;
import com.paf.learnhub.Services.VideoService;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @PostMapping(consumes = {"multipart/form-data"})
    public VideoResponse uploadVideo(
            @RequestParam("postId") String postId,
            @RequestParam("userId") String userId,
            @RequestParam("userName") String userName,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("video") MultipartFile videoFile,
            @RequestParam("thumbnail") MultipartFile thumbnailFile) throws IOException {
        Binary videoData = new Binary(videoFile.getBytes());
        Binary thumbnailData = new Binary(thumbnailFile.getBytes());
        Video video = videoService.uploadVideo(postId, userId, userName, title, description, videoData, thumbnailData);
        return toResponse(video);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<VideoResponse> updateVideo(
            @PathVariable String id,
            @RequestParam("userId") String userId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "video", required = false) MultipartFile videoFile,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnailFile) throws IOException {
        try {
            Binary videoData = videoFile != null && !videoFile.isEmpty() ? new Binary(videoFile.getBytes()) : null;
            Binary thumbnailData = thumbnailFile != null && !thumbnailFile.isEmpty() ? new Binary(thumbnailFile.getBytes()) : null;
            Video video = videoService.updateVideo(id, userId, title, description, videoData, thumbnailData);
            return ResponseEntity.ok(toResponse(video));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new VideoResponse(id, "", "", "", "", "", "", "", ""));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(
            @PathVariable String id,
            @RequestParam("userId") String userId) {
        try {
            videoService.deleteVideo(id, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoResponse> getVideoById(@PathVariable String id) {
        try {
            Video video = videoService.getVideoById(id);
            return ResponseEntity.ok(toResponse(video));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new VideoResponse(id, "", "", "", "", "", "", "", ""));
        }
    }

    @GetMapping("/post/{postId}")
    public List<VideoResponse> getVideosByPostId(@PathVariable String postId) {
        return videoService.getVideosByPostId(postId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/post/allvideos")
    public List<VideoResponse> getAllVideos() {
        return videoService.getAllVideos().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Convert Video to VideoResponse with base64 strings
    private VideoResponse toResponse(Video video) {
        return new VideoResponse(
                video.getId(),
                video.getPostId(),
                video.getUserId(),
                video.getUserName(),
                video.getTitle(),
                video.getDescription(),
                video.getVideoData() != null ? Base64.getEncoder().encodeToString(video.getVideoData().getData()) : "",
                video.getThumbnailData() != null ? Base64.getEncoder().encodeToString(video.getThumbnailData().getData()) : "",
                video.getCreatedAt()
        );
    }

    // Response DTO to send base64 strings
    public static class VideoResponse {
        private String id;
        private String postId;
        private String userId;
        private String userName;
        private String title;
        private String description;
        private String videoData; // Base64 string
        private String thumbnailData; // Base64 string
        private String createdAt;

        public VideoResponse(String id, String postId, String userId, String userName, String title,
                             String description, String videoData, String thumbnailData, String createdAt) {
            this.id = id;
            this.postId = postId;
            this.userId = userId;
            this.userName = userName;
            this.title = title;
            this.description = description;
            this.videoData = videoData;
            this.thumbnailData = thumbnailData;
            this.createdAt = createdAt;
        }

        // Getters
        public String getId() { return id; }
        public String getPostId() { return postId; }
        public String getUserId() { return userId; }
        public String getUserName() { return userName; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getVideoData() { return videoData; }
        public String getThumbnailData() { return thumbnailData; }
        public String getCreatedAt() { return createdAt; }
    }
}