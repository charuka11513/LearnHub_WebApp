package com.paf.learnhub.Services;

import org.bson.types.ObjectId;
import com.paf.learnhub.models.Post;
import com.paf.learnhub.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private VideoService videoService;

    @Autowired
    private GridFsTemplate gridFsTemplate;

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
    
    public Post getPostById(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
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
        // Delete associated videos
        videoService.deleteVideosByPostId(id);
        // Delete GridFS image if exists
        if (post.getImageId() != null) {
            Query query = new Query(Criteria.where("_id").is(new ObjectId(post.getImageId())));
            gridFsTemplate.delete(query);
        }
        // Delete post
        postRepository.deleteById(id);
    }

    public void likePost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);
    }
}