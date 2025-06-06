package com.Training.backend.controllers;
import com.Training.backend.auth.LoginSession;
import com.Training.backend.dtos.SignupRequest;
import com.Training.backend.entity.User;
import com.Training.backend.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")  // Allow all origins (for dev)
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // DTO for consistent JSON message responses
    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> signup(@RequestBody SignupRequest request) {
        try {
            // Check if user with email already exists
            Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("User already exists"));
            }

            // Create new user and save
            User newUser = new User(request.getName(), request.getEmail(), request.getPassword());
            userRepository.save(newUser);

            return ResponseEntity.ok(new MessageResponse("User registered successfully"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("An unexpected error occurred: " + e.getMessage()));
        }
    }

  @PostMapping("/login")
public ResponseEntity<MessageResponse> login(@RequestBody User user) {
    Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

    if (existingUser.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("User not found"));
    }

    if (!existingUser.get().getPassword().equals(user.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Incorrect password"));
    }

    //Store email temporarily
    LoginSession.currentUserEmail = existingUser.get().getEmail();

    return ResponseEntity.ok(new MessageResponse("Login successful"));
}



}
