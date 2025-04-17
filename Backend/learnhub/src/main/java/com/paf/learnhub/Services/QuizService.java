package com.paf.learnhub.Services;

import com.paf.learnhub.models.Quiz;
import com.paf.learnhub.repositories.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    public Quiz createQuiz(String videoId, String userId, String userName, List<Quiz.Question> questions) {
        if (questions.size() < 5) {
            throw new RuntimeException("Quiz must have at least 5 questions");
        }
        for (Quiz.Question q : questions) {
            if (q.getAnswers().size() != 4 || q.getCorrectAnswerIndex() < 0 || q.getCorrectAnswerIndex() > 3) {
                throw new RuntimeException("Each question must have exactly 4 answers and a valid correct answer index");
            }
        }
        Quiz quiz = new Quiz();
        quiz.setId(UUID.randomUUID().toString());
        quiz.setVideoId(videoId);
        quiz.setUserId(userId);
        quiz.setUserName(userName);
        quiz.setQuestions(questions);
        return quizRepository.save(quiz);
    }

    public Quiz updateQuiz(String quizId, String userId, List<Quiz.Question> questions) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        if (!quiz.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        if (questions.size() < 5) {
            throw new RuntimeException("Quiz must have at least 5 questions");
        }
        for (Quiz.Question q : questions) {
            if (q.getAnswers().size() != 4 || q.getCorrectAnswerIndex() < 0 || q.getCorrectAnswerIndex() > 3) {
                throw new RuntimeException("Each question must have exactly 4 answers and a valid correct answer index");
            }
        }
        quiz.setQuestions(questions);
        return quizRepository.save(quiz);
    }

    public void deleteQuiz(String quizId, String userId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        if (!quiz.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        quizRepository.deleteById(quizId);
    }

    public Quiz getQuizByVideoId(String videoId) {
        return quizRepository.findByVideoId(videoId)
                .orElseThrow(() -> new RuntimeException("Quiz not found for video"));
    }

    public int calculateScore(String quizId, List<Integer> userAnswers) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        if (userAnswers.size() != quiz.getQuestions().size()) {
            throw new RuntimeException("Invalid number of answers submitted");
        }
        int score = 0;
        for (int i = 0; i < quiz.getQuestions().size(); i++) {
            if (userAnswers.get(i) == quiz.getQuestions().get(i).getCorrectAnswerIndex()) {
                score++;
            }
        }
        return score;
    }
}