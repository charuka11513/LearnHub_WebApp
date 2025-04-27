package com.leaning.learning_management.repository;

import com.leaning.learning_management.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CourseRepository extends MongoRepository<Course, String> {
    // Custom query methods can go here if needed
}
