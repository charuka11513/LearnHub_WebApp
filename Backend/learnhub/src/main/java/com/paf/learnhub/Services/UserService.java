package com.paf.learnhub.Services;

import com.paf.learnhub.models.User;
import com.paf.learnhub.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public User register(String name, String email, String password) {
        logger.info("Registering user with email: {}", email);
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            logger.warn("Email already exists: {}", email);
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setAuthProvider("email");
        User savedUser = userRepository.save(user);
        logger.info("User registered successfully: {}", email);
        return savedUser;
    }

    public User login(String email, String password) {
        logger.info("Logging in user with email: {}", email);
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getAuthProvider().equals("email") && user.get().getPassword().equals(password)) {
            logger.info("Login successful for: {}", email);
            return user.get();
        }
        logger.warn("Invalid credentials for: {}", email);
        throw new RuntimeException("Invalid credentials");
    }

    public User handleOAuthLogin(OAuth2AuthenticationToken token) {
        if (token == null) {
            logger.error("OAuth token is null");
            throw new RuntimeException("OAuth token is null");
        }

        logger.info("Handling OAuth login for provider: {}", token.getAuthorizedClientRegistrationId());
        Map<String, Object> attributes = token.getPrincipal().getAttributes();
        String provider = token.getAuthorizedClientRegistrationId();
        String email = null;
        String name = null;
        String avatarUrl = null;

        try {
            if ("google".equals(provider)) {
                email = (String) attributes.get("email");
                name = (String) attributes.get("name");
                avatarUrl = (String) attributes.get("picture");
            } else if ("github".equals(provider)) {
                email = (String) attributes.get("email");
                name = (String) attributes.get("login");
                avatarUrl = (String) attributes.get("avatar_url");
                if (email == null) {
                    email = name + "@github.com"; // Fallback
                    logger.info("GitHub email not provided, using fallback: {}", email);
                }
            } else {
                logger.error("Unsupported provider: {}", provider);
                throw new RuntimeException("Unsupported provider: " + provider);
            }

            if (email == null || name == null) {
                logger.error("Missing required attributes - email: {}, name: {}", email, name);
                throw new RuntimeException("Missing required OAuth attributes");
            }

            logger.info("OAuth user attributes - email: {}, name: {}, avatar: {}", email, name, avatarUrl);
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                logger.info("Existing OAuth user found: {}", email);
                return existingUser.get();
            }

            User user = new User();
            user.setId(UUID.randomUUID().toString());
            user.setEmail(email);
            user.setName(name);
            user.setAvatarUrl(avatarUrl);
            user.setAuthProvider(provider);
            User savedUser = userRepository.save(user);
            logger.info("New OAuth user created: {}", email);
            return savedUser;
        } catch (Exception e) {
            logger.error("Error handling OAuth login: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process OAuth login: " + e.getMessage());
        }
    }

    public User updateUser(String id, String name, String email) {
        logger.info("Updating user with ID: {}", id);
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            logger.warn("User not found: {}", id);
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        user.setName(name);
        user.setEmail(email);
        User updatedUser = userRepository.save(user);
        logger.info("User updated successfully: {}", id);
        return updatedUser;
    }

    public Optional<User> findById(String id) {
        logger.info("Finding user with ID: {}", id);
        return userRepository.findById(id);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
}
