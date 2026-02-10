package com.chitkara.bfhl.service;

import com.chitkara.bfhl.dto.BfhlRequest;
import com.chitkara.bfhl.exception.InvalidRequestException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BfhlServiceImpl implements BfhlService {

    private final AIService aiService;

    public BfhlServiceImpl(AIService aiService) {
        this.aiService = aiService;
    }

    @Override
    public Object processRequest(BfhlRequest request) {
        if (request == null) {
            throw new InvalidRequestException("Request body cannot be null");
        }

        int count = 0;
        if (request.getFibonacci() != null)
            count++;
        if (request.getPrime() != null)
            count++;
        if (request.getLcm() != null)
            count++;
        if (request.getHcf() != null)
            count++;
        if (request.getAI() != null)
            count++;

        if (count == 0) {
            throw new InvalidRequestException("No valid key provided");
        }
        if (count > 1) {
            throw new InvalidRequestException("Only one key is allowed per request");
        }

        // Fibonacci Logic
        if (request.getFibonacci() != null) {
            int n = request.getFibonacci();
            if (n < 0) {
                throw new InvalidRequestException("Fibonacci value must be positive");
            }
            if (n > 1000) {
                throw new InvalidRequestException("Fibonacci value too large (max 1000)");
            }
            if (n == 0)
                return new ArrayList<>();

            List<Integer> fibSeries = new ArrayList<>();
            fibSeries.add(0);
            if (n == 1)
                return fibSeries;

            fibSeries.add(1);
            if (n == 2)
                return fibSeries;

            for (int i = 2; i < n; i++) {
                fibSeries.add(fibSeries.get(i - 1) + fibSeries.get(i - 2));
            }
            return fibSeries;
        }

        // Prime Logic
        if (request.getPrime() != null) {
            List<Integer> input = request.getPrime();
            if (input == null)
                throw new InvalidRequestException("Prime list cannot be null");

            List<Integer> result = new ArrayList<>();
            for (Integer num : input) {
                if (num == null)
                    throw new InvalidRequestException("List contains null values");
                if (isPrime(num)) {
                    result.add(num);
                }
            }
            return result;
        }

        // LCM Logic
        if (request.getLcm() != null) {
            List<Integer> input = request.getLcm();
            if (input == null)
                throw new InvalidRequestException("LCM list cannot be null");
            if (input.isEmpty())
                throw new InvalidRequestException("LCM list cannot be empty");

            int result = input.get(0);
            if (result == 0)
                throw new InvalidRequestException("LCM cannot be calculated with zero");
            if (result < 0)
                throw new InvalidRequestException("LCM input cannot be negative");

            for (int i = 1; i < input.size(); i++) {
                Integer val = input.get(i);
                if (val == null)
                    throw new InvalidRequestException("List contains null values");
                if (val == 0)
                    throw new InvalidRequestException("LCM cannot be calculated with zero");
                if (val < 0)
                    throw new InvalidRequestException("LCM input cannot be negative");
                result = lcm(result, val);
            }
            return result;
        }

        // HCF Logic
        if (request.getHcf() != null) {
            List<Integer> input = request.getHcf();
            if (input == null)
                throw new InvalidRequestException("HCF list cannot be null");
            if (input.isEmpty())
                throw new InvalidRequestException("HCF list cannot be empty");

            int result = input.get(0);
            if (result == 0)
                throw new InvalidRequestException("HCF cannot be calculated with zero");
            if (result < 0)
                throw new InvalidRequestException("HCF input cannot be negative");

            for (int i = 1; i < input.size(); i++) {
                Integer val = input.get(i);
                if (val == null)
                    throw new InvalidRequestException("List contains null values");
                if (val == 0)
                    throw new InvalidRequestException("HCF cannot be calculated with zero");
                if (val < 0)
                    throw new InvalidRequestException("HCF input cannot be negative");
                result = gcd(result, val);
            }
            return result;
        }

        // AI Logic
        if (request.getAI() != null) {
            String question = request.getAI().trim();
            if (question.isEmpty())
                throw new InvalidRequestException("AI question cannot be empty");
            return aiService.getSingleWordAnswer(question);
        }

        throw new InvalidRequestException("Unknown error");
    }

    private boolean isPrime(int n) {
        if (n <= 1)
            return false;
        if (n == 2)
            return true;
        if (n % 2 == 0)
            return false;
        for (int i = 3; i * i <= n; i += 2) {
            if (n % i == 0)
                return false;
        }
        return true;
    }

    private int gcd(int a, int b) {
        if (a == 0)
            return b;
        if (b == 0)
            return a;
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    private int lcm(int a, int b) {
        if (a == 0 || b == 0)
            return 0;
        return Math.abs(a * b) / gcd(a, b);
    }
}
