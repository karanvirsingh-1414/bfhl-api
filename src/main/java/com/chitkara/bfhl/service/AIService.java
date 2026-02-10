package com.chitkara.bfhl.service;

import com.chitkara.bfhl.exception.InvalidRequestException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    // Use Gemini model
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=";

    public AIService(RestTemplate restTemplate, @Value("${gemini.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
    }

    public String getSingleWordAnswer(String question) {
        if (question == null || question.trim().isEmpty()) {
            throw new InvalidRequestException("AI question cannot be empty");
        }

        String fullUrl = GEMINI_API_URL + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Gemini JSON Structure:
        // {
        // "contents": [{
        // "parts": [{ "text": "Respond with one word: {question}" }]
        // }]
        // }

        Map<String, Object> requestBody = new HashMap<>();

        // Combine system prompt and user question into one prompt because Gemini
        // "system instruction" is separate
        // and for simplicity we can just prepend instruction.
        String prompt = "Respond with ONLY one word. No punctuation. Question: " + question;

        Map<String, String> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));

        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, entity, String.class);

            JsonNode rootNode = objectMapper.readTree(response.getBody());
            // Gemini Response Structure:
            // candidates[0].content.parts[0].text
            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");

            if (textNode.isMissingNode()) {
                throw new RuntimeException("Empty response from AI");
            }

            String answer = textNode.asText().trim();
            // Remove any trailing punctuation/newlines
            answer = answer.replaceAll("[^a-zA-Z0-9]", "");

            return answer;

        } catch (Exception e) {
            throw new RuntimeException("Failed to get AI response: " + e.getMessage());
        }
    }
}
