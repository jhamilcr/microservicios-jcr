package com.example.purchases.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class EventClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public EventClient(RestTemplate restTemplate,
                       @Value("${app.events-service-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }
public Map<String, Object> getEvent(String eventId) {
    try {
        String url = baseUrl + "/" + eventId;
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        if (response == null) {
            throw new IllegalArgumentException("Evento no encontrado para ID: " + eventId);
        }
        return response;
    } catch (org.springframework.web.client.HttpClientErrorException e) {
        if (e.getStatusCode().is4xxClientError()) {
            throw new IllegalArgumentException("Evento no encontrado para ID: " + eventId);
        }
        throw new IllegalStateException("Error al obtener el evento con ID: " + eventId, e);
    } catch (Exception e) {
        throw new IllegalStateException("Error al obtener el evento con ID: " + eventId, e);
    }
}
}   