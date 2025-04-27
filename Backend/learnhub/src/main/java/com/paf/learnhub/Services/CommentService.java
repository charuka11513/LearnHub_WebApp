package com.paf.learnhub.Services;

import com.paf.learnhub.models.Comment;
import com.paf.learnhub.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment addComment(String postId, String userId, String userName, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }
        Comment comment = new Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setUserName(userName);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now().toString());
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    // *** Changed Code Section Start ***
    public Comment updateComment(String commentId, String content, String userId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (!commentOpt.isPresent() || !commentOpt.get().getUserId().equals(userId)) {
            throw new RuntimeException("Comment not found or unauthorized");
        }
        Comment comment = commentOpt.get();
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now().toString()); // Update timestamp
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String userId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (!commentOpt.isPresent() || !commentOpt.get().getUserId().equals(userId)) {
            throw new RuntimeException("Comment not found or unauthorized");
        }
        commentRepository.deleteById(commentId);
    }

    public void deleteCommentsByPostId(String postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        commentRepository.deleteAll(comments);
    }

    public void deleteCommentsByUserId(String userId) {
        List<Comment> comments = commentRepository.findByUserId(userId);
        commentRepository.deleteAll(comments);
    }
    // *** Changed Code Section End ***
}