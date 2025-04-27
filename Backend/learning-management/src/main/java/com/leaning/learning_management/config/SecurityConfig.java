package com.leaning.learning_management.config;

//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/api/courses/create").permitAll() // Public path
//                        .requestMatchers("/api/courses/getall").permitAll() // Public path
//                        .requestMatchers("/api/courses/get/**").permitAll()
//                        .requestMatchers("/api/courses/update/**").permitAll()
//                        .requestMatchers("/api/courses/delete/**").permitAll()
//                        .requestMatchers("/api/courses/upload/**").permitAll()
//                        .anyRequest().authenticated() // All other requests require authentication
//                )
//                .httpBasic(Customizer.withDefaults());
//
//        return http.build();
//    }
//}
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .httpBasic().disable()
                .formLogin().disable();
        return http.build();
    }
}
