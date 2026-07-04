package com.garrison.leaderboard.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {

    @Value("${app.api-key:dev-api-key-change-in-production}")
    private String apiKey;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new ApiKeyInterceptor())
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/health");
    }

    private class ApiKeyInterceptor implements HandlerInterceptor {
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            // Skip validation for OPTIONS (CORS preflight)
            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                return true;
            }

            String requestApiKey = request.getHeader("X-API-Key");
            if (apiKey.equals(requestApiKey)) {
                return true;
            }

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Invalid or missing API key\"}");
            response.setContentType("application/json");
            return false;
        }
    }
}