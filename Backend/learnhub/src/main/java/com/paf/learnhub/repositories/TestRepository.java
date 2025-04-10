package com.paf.learnhub.repositories;


import com.paf.learnhub.models.TestUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestRepository extends MongoRepository<TestUser, String> {
    // No custom queries for now
}