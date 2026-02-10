package com.chitkara.bfhl.controller;

import com.chitkara.bfhl.dto.ApiResponse;
import com.chitkara.bfhl.dto.BfhlRequest;
import com.chitkara.bfhl.service.BfhlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class BfhlController {

    private final BfhlService bfhlService;

    public BfhlController(BfhlService bfhlService) {
        this.bfhlService = bfhlService;
    }

    @PostMapping("/bfhl")
    public ResponseEntity<ApiResponse> handleRequest(@RequestBody BfhlRequest request) {
        Object result = bfhlService.processRequest(request);
        return ResponseEntity.ok(new ApiResponse(true, result));
    }
}
