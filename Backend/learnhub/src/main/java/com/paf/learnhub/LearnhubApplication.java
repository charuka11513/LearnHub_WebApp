package com.paf.learnhub;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class LearnhubApplication {
    private static final Logger logger = LoggerFactory.getLogger(LearnhubApplication.class);

    public static void main(String[] args) {
        // Hardcode configuration values
        System.setProperty("MONGODB_URI", "mongodb+srv://ashandilakshana2002:ashan1234@cluster00.yv7ol.mongodb.net/LearnHub?retryWrites=true&w=majority");
        System.setProperty("DATABASE_NAME", "LearnHub");
        System.setProperty("SERVER_PORT", "8080");

        logger.info("Configuration values set in code: MONGODB_URI, DATABASE_NAME, SERVER_PORT");

        SpringApplication.run(LearnhubApplication.class, args);
    }

    
}