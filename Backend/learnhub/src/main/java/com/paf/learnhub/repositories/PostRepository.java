package com.paf.learnhub.repositories;

import com.paf.learnhub.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
}