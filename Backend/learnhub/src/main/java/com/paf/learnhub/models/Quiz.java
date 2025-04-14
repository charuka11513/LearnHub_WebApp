package com.paf.learnhub.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "quizzes")
public class Quiz {
    @Id
    private String id;
    private String videoId;
    private String userId;
    private String userName;
    private List<Question> questions;

    public static class Question {
        private String questionText;
        private List<String> answers; // 4 answers
        private int correctAnswerIndex; // 0-3

        // Getters and Setters
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        public List<String> getAnswers() { return answers; }
        public void setAnswers(List<String> answers) { this.answers = answers; }
        public int getCorrectAnswerIndex() { return correctAnswerIndex; }
        public void setCorrectAnswerIndex(int correctAnswerIndex) { this.correctAnswerIndex = correctAnswerIndex; }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getVideoId() { return videoId; }
    public void setVideoId(String videoId) { this.videoId = videoId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
}