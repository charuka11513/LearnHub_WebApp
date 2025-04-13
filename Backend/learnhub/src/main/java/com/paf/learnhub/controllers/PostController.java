package com.paf.learnhub.controllers;

import com.mongodb.client.gridfs.model.GridFSFile;
import com.paf.learnhub.models.Post;
import com.paf.learnhub.Services.PostService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GridFsOperations gridFsOperations;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createPost(
            @RequestParam("userId") String userId,
            @RequestParam("userName") String userName,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            System.out.println("POST /api/posts received: userId=" + userId + ", userName=" + userName + ", content=" + content + ", image=" + (image != null ? image.getOriginalFilename() : "null"));
            String imageId = null;
            if (image != null && !image.isEmpty()) {
                InputStream inputStream = image.getInputStream();
                ObjectId fileId = gridFsTemplate.store(
                    inputStream,
                    image.getOriginalFilename(),
                    image.getContentType()
                );
                imageId = fileId.toString();
                System.out.println("Image stored in GridFS: id=" + imageId);
            }
            Post post = postService.createPost(userId, userName, content, imageId);
            System.out.println("Post created: id=" + post.getId());
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (IOException e) {
            System.err.println("File upload error: " + e.getMessage());
            return new ResponseEntity<>(
                new ErrorResponse("File Upload Error", e.getMessage()),
                HttpStatus.BAD_REQUEST
            );
        } catch (Exception e) {
            System.err.println("Server error: " + e.getMessage());
            return new ResponseEntity<>(
                new ErrorResponse("Server Error", e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Post>> getAllPosts() {
        System.out.println("GET /api/posts called");
        return new ResponseEntity<>(postService.getAllPosts(), HttpStatus.OK);
    }

    @GetMapping(value = "/image/{imageId}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public ResponseEntity<byte[]> getImage(@PathVariable String imageId) {
        try {
            GridFSFile file = gridFsTemplate.findOne(new org.springframework.data.mongodb.core.query.Query(
                org.springframework.data.mongodb.core.query.Criteria.where("_id").is(new ObjectId(imageId))
            ));
            if (file == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            InputStream inputStream = gridFsOperations.getResource(file).getInputStream();
            byte[] imageBytes = inputStream.readAllBytes();
            inputStream.close();
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getMetadata().getString("_contentType")))
                .body(imageBytes);
        } catch (IOException e) {
            System.err.println("Image retrieval error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updatePost(@PathVariable String id, @RequestBody Post post) {
        try {
            System.out.println("PUT /api/posts/" + id);
            Post updatedPost = postService.updatePost(id, post.getContent(), post.getUserId());
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Update error: " + e.getMessage());
            return new ResponseEntity<>(
                new ErrorResponse("Update Error", e.getMessage()),
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id, @RequestBody Post post) {
        try {
            System.out.println("DELETE /api/posts/" + id);
            postService.deletePost(id, post.getUserId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Delete error: " + e.getMessage());
            return new ResponseEntity<>(
                new ErrorResponse("Delete Error", e.getMessage()),
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable String id) {
        try {
            System.out.println("POST /api/posts/" + id + "/like");
            postService.likePost(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Like error: " + e.getMessage());
            return new ResponseEntity<>(
                new ErrorResponse("Like Error", e.getMessage()),
                HttpStatus.BAD_REQUEST
            );
        }
    }


    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        try {
            System.out.println("GET /api/posts/" + id);
            Post post = postService.getPostById(id);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error fetching post: " + e.getMessage());
            return new ResponseEntity<>(
                new ErrorResponse("Post Not Found", e.getMessage()),
                HttpStatus.NOT_FOUND
            );
        }
    }
    private static class ErrorResponse {
        private String error;
        private String message;

        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message != null ? message : "No details available";
        }

        public String getError() {
            return error;
        }

        public String getMessage() {
            return message;
        }
    }
}