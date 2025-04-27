package com.paf.learnhub.Configuration;

import com.paf.learnhub.models.User;
import com.paf.learnhub.Services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@Component
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2SuccessHandler.class);

    @Autowired
    private UserService userService;

    public CustomOAuth2SuccessHandler() {
        super("http://localhost:5173/auth/callback");
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        HttpSession session = request.getSession();
        logger.info("OAuth2 authentication success, session ID: {}, request URI: {}", 
                    session.getId(), request.getRequestURI());
        if (!(authentication instanceof OAuth2AuthenticationToken token)) {
            logger.error("Invalid authentication: type={}", 
                         authentication != null ? authentication.getClass().getName() : "null");
            response.sendRedirect("http://localhost:5173/login?error=invalid_auth");
            return;
        }

        String provider = token.getAuthorizedClientRegistrationId();
        logger.debug("Processing provider: {}, attributes: {}", provider, token.getPrincipal().getAttributes());
        try {
            User user = userService.handleOAuthLogin(token);
            if (user == null || user.getId() == null || user.getEmail() == null) {
                logger.error("Invalid user: id={}, email={}, provider={}", 
                             user != null ? user.getId() : "null", 
                             user != null ? user.getEmail() : "null", provider);
                response.sendRedirect("http://localhost:5173/login?error=user_creation_failed");
                return;
            }
            session.setAttribute("userId", user.getId());
            logger.info("Stored user: id={}, email={}, provider={}", 
                        user.getId(), user.getEmail(), provider);
        } catch (Exception e) {
            logger.error("OAuth login failed: provider={}, error={}", provider, e.getMessage(), e);
            response.sendRedirect("http://localhost:5173/login?error=oauth_failed");
            return;
        }
        logger.info("Redirecting to frontend: http://localhost:5173/auth/callback");
        super.onAuthenticationSuccess(request, response, authentication);
    }
}