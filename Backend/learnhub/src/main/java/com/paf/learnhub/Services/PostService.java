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

    public Post createPost(Post post, String photoUrl, String videoUrl) {
        post.setCreatedAt(LocalDateTime.now());
        post.setPhotoUrl(photoUrl);
        post.setVideoUrl(videoUrl);
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(String id) {
        return postRepository.findById(id).orElse(null);
    }

    public Post updatePost(Post post) {
        return postRepository.save(post);
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }
}