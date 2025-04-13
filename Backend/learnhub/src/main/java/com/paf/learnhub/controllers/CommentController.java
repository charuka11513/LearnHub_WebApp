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
    public Comment addComment(@RequestBody Comment comment) {
        return commentService.addComment(
            comment.getPostId(),
            comment.getUserId(),
            comment.getUserName(),
            comment.getContent()
        );
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPostId(@PathVariable String postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable String id, @RequestBody Comment comment) {
        return commentService.updateComment(id, comment.getContent(), comment.getUserId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id, @RequestBody Comment comment) {
        commentService.deleteComment(id, comment.getUserId());
        return ResponseEntity.ok().build();
    }
}