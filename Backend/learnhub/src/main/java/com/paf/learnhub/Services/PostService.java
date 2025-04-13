package com.paf.learnhub.Services;

import com.paf.learnhub.models.Post;
import com.paf.learnhub.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(String userId, String userName, String content, String imageId) {
        Post post = new Post();
        post.setUserId(userId);
        post.setUserName(userName);
        post.setContent(content);
        post.setImageId(imageId);
        post.setCreatedAt(LocalDateTime.now().toString());
        post.setLikes(0);
        post.setComments(List.of());
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post updatePost(String id, String content, String userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        post.setContent(content);
        return postRepository.save(post);
    }

    public void deletePost(String id, String userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        postRepository.deleteById(id);
    }

    public void likePost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);
    }
}