package com.paf.learnhub.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<String>> getQuizzesByPostId(@PathVariable String postId) {
        // Placeholder: Return empty list for now
        return ResponseEntity.ok(Collections.emptyList());
    }
}