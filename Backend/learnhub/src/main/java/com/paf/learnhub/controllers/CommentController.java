package com.paf.learnhub.controllers;

import com.paf.learnhub.models.Comment;
import com.paf.learnhub.Services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        try {
            Comment savedComment = commentService.addComment(
                comment.getPostId(),
                comment.getUserId(),
                comment.getUserName(),
                comment.getContent()
            );
            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        try {
            List<Comment> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    // *** Changed Code Section Start ***
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String id,
            @RequestBody UpdateCommentRequest request) {
        try {
            Comment updatedComment = commentService.updateComment(
                id,
                request.getContent(),
                request.getUserId()
            );
            return ResponseEntity.ok(updatedComment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id, @RequestBody Comment comment) {
        commentService.deleteComment(id, comment.getUserId());
        return ResponseEntity.ok().build();
    };
    public static class UpdateCommentRequest {
        private String userId;
        private String content;

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
    // *** Changed Code Section End ***
}