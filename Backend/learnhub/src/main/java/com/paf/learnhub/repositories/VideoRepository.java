package com.paf.learnhub.repositories;

import com.paf.learnhub.models.Video;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VideoRepository extends MongoRepository<Video, String> {
    List<Video> findByPostId(String postId);
}