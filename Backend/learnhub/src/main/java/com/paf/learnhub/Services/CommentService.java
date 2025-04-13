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

    public Comment updateComment(String commentId, String content, String userId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (!commentOpt.isPresent() || !commentOpt.get().getUserId().equals(userId)) {
            throw new RuntimeException("Comment not found or unauthorized");
        }
        Comment comment = commentOpt.get();
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String userId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (!commentOpt.isPresent() || !commentOpt.get().getUserId().equals(userId)) {
            throw new RuntimeException("Comment not found or unauthorized");
        }
        commentRepository.deleteById(commentId);
    }
}