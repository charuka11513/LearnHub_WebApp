package com.paf.learnhub.controllers;

import com.paf.learnhub.models.Video;
import com.paf.learnhub.Services.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos")
public class VideoController {
    @Autowired
    private VideoService videoService;

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<Video> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("postId") String postId,
            @RequestParam("userId") String userId) {
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            String videoFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path videoPath = Paths.get(UPLOAD_DIR + videoFileName);
            Files.write(videoPath, file.getBytes());
            String videoUrl = "/uploads/" + videoFileName;

            Video video = new Video();
            video.setPostId(postId);
            video.setUserId(userId);
            video.setVideoUrl(videoUrl);
            return ResponseEntity.ok(videoService.uploadVideo(video));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Video>> getVideosByPostId(@PathVariable String postId) {
        return ResponseEntity.ok(videoService.getVideosByPostId(postId));
    }
}