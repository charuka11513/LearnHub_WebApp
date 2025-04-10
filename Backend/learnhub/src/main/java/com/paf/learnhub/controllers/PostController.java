package com.paf.learnhub.controllers;

import com.paf.learnhub.models.Post;
import com.paf.learnhub.Services.PostService;
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
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/create")
    public ResponseEntity<Post> createPost(
            @RequestParam("description") String description,
            @RequestParam("userId") String userId,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "video", required = false) MultipartFile video) {
        try {
            // Create the uploads directory if it doesn't exist
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            // Handle photo upload
            String photoUrl = null;
            if (photo != null && !photo.isEmpty()) {
                if (!photo.getContentType().startsWith("image/")) {
                    return ResponseEntity.badRequest().body(null);
                }
                String photoFileName = UUID.randomUUID() + "_" + photo.getOriginalFilename();
                Path photoPath = Paths.get(UPLOAD_DIR + photoFileName);
                Files.write(photoPath, photo.getBytes());
                photoUrl = "/uploads/" + photoFileName;
            }

            // Handle video upload
            String videoUrl = null;
            if (video != null && !video.isEmpty()) {
                if (!video.getContentType().startsWith("video/")) {
                    return ResponseEntity.badRequest().body(null);
                }
                String videoFileName = UUID.randomUUID() + "_" + video.getOriginalFilename();
                Path videoPath = Paths.get(UPLOAD_DIR + videoFileName);
                Files.write(videoPath, video.getBytes());
                videoUrl = "/uploads/" + videoFileName;
            }

            // Create the post
            Post post = new Post();
            post.setUserId(userId);
            post.setDescription(description);
            Post savedPost = postService.createPost(post, photoUrl, videoUrl);

            return ResponseEntity.ok(savedPost);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Post post = postService.getPostById(id);
        return post != null ? ResponseEntity.ok(post) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        Post existingPost = postService.getPostById(id);
        if (existingPost != null) {
            existingPost.setDescription(post.getDescription());
            return ResponseEntity.ok(postService.updatePost(existingPost));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable String id, @RequestBody String userId) {
        Post post = postService.getPostById(id);
        if (post != null) {
            post.getLikes().add(userId);
            return ResponseEntity.ok(postService.updatePost(post));
        }
        return ResponseEntity.notFound().build();
    }
}