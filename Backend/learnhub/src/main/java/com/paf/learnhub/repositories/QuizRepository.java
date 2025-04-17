package com.paf.learnhub.repositories;

import com.paf.learnhub.models.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    Optional<Quiz> findByVideoId(String videoId);
}