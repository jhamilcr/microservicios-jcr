package com.example.purchases.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RabbitMQProducer {

    private final RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.queue}")
    private String queueName;

    public RabbitMQProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendPurchasePaidEvent(Long purchaseId, String userEmail) {
        Map<String, Object> message = new HashMap<>();
        message.put("purchaseId", purchaseId);
        message.put("email", userEmail);
        message.put("status", "PAID");
        rabbitTemplate.convertAndSend(queueName, message);
        System.out.println("📨 Mensaje enviado a cola: " + message);
    }
}