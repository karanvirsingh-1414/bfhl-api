package com.chitkara.bfhl.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {

    @JsonProperty("is_success")
    private boolean is_success;

    @JsonProperty("official_email")
    private String official_email;

    @JsonProperty("data")
    private Object data;

    public ApiResponse(boolean is_success, Object data) {
        this.is_success = is_success;
        this.data = data;
        this.official_email = "karanvir2031.be23@chitkara.edu.in";
    }

    @JsonProperty("is_success")
    public boolean is_success() {
        return is_success;
    }
}
