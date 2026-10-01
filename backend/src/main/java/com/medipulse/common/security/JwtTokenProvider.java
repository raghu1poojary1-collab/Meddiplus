package com.medipulse.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expirationMs;

    public JwtTokenProvider(
            @Value("${medipulse.jwt.secret:MedPulseSecretKeyForJwtAuthenticationSuperSecure32BytesLongMinimumKey!}") String secret,
            @Value("${medipulse.jwt.expiration-ms:86400000}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(String username, Long hospitalId, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        Map<String, Object> claims = new HashMap<>();
        claims.put("hospitalId", hospitalId);
        claims.put("role", role);

        return Jwts.builder()
                .subject(username)
                .claims(claims)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.getSubject();
    }

    public Long getHospitalIdFromToken(String token) {
        Claims claims = getClaims(token);
        Object hospId = claims.get("hospitalId");
        if (hospId instanceof Number) {
            return ((Number) hospId).longValue();
        }
        return null;
    }

    public String getRoleFromToken(String token) {
        Claims claims = getClaims(token);
        return (String) claims.get("role");
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
