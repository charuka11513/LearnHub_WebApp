package com.paf.learnhub.controllers;

import com.paf.learnhub.models.Quiz;
import com.paf.learnhub.Services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/video/{videoId}")
    public ResponseEntity<Quiz> createQuiz(
            @PathVariable String videoId,
            @RequestBody QuizRequest quizRequest) {
        try {
            Quiz quiz = quizService.createQuiz(
                    videoId,
                    quizRequest.userId,
                    quizRequest.userName,
                    quizRequest.questions
            );
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<Quiz> updateQuiz(
            @PathVariable String quizId,
            @RequestBody QuizRequest quizRequest) {
        try {
            Quiz quiz = quizService.updateQuiz(
                    quizId,
                    quizRequest.userId,
                    quizRequest.questions
            );
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<Void> deleteQuiz(
            @PathVariable String quizId,
            @RequestParam String userId) {
        try {
            quizService.deleteQuiz(quizId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/video/{videoId}")
    public ResponseEntity<Quiz> getQuizByVideoId(@PathVariable String videoId) {
        try {
            Quiz quiz = quizService.getQuizByVideoId(videoId);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<ScoreResponse> submitAnswers(
            @PathVariable String quizId,
            @RequestBody List<Integer> userAnswers) {
        try {
            int score = quizService.calculateScore(quizId, userAnswers);
            return ResponseEntity.ok(new ScoreResponse(score, userAnswers.size()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    public static class QuizRequest {
        private String userId;
        private String userName;
        private List<Quiz.Question> questions;

        // Getters and Setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public List<Quiz.Question> getQuestions() { return questions; }
        public void setQuestions(List<Quiz.Question> questions) { this.questions = questions; }
    }

    public static class ScoreResponse {
        private int score;
        private int total;

        public ScoreResponse(int score, int total) {
            this.score = score;
            this.total = total;
        }

        // Getters
        public int getScore() { return score; }
        public int getTotal() { return total; }
    }
}