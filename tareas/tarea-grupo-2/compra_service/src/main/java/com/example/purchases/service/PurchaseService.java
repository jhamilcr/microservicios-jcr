package com.example.purchases.service;

import com.example.purchases.messaging.RabbitMQProducer;
import com.example.purchases.model.Purchase;
import com.example.purchases.repository.PurchaseRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final RabbitMQProducer rabbitMQProducer;
    private final EventClient eventClient;

    public PurchaseService(PurchaseRepository purchaseRepository, RabbitMQProducer rabbitMQProducer, EventClient eventClient) {
        this.purchaseRepository = purchaseRepository;
        this.rabbitMQProducer = rabbitMQProducer;
        this.eventClient = eventClient;
    }

    public Purchase createPurchase(Purchase purchase) {
    Map<String, Object> event = eventClient.getEvent(purchase.getEventId().toString());
    if (event == null) {
        throw new IllegalArgumentException("Evento no encontrado");
    }
    Object capacityObj = event.get("capacidad"); // Cambiado de "capacity" a "capacidad"
    if (capacityObj == null) {
        throw new IllegalArgumentException("El evento no tiene el campo 'capacidad'");
    }
    int capacity;
    if (capacityObj instanceof Number) {
        capacity = ((Number) capacityObj).intValue();
    } else {
        try {
            capacity = Integer.parseInt(capacityObj.toString());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("El campo 'capacidad' no es un número válido");
        }
    }
    if (purchase.getQuantity() > capacity) {
        throw new IllegalArgumentException("No hay suficiente capacidad para el evento");
    }
    purchase.setPaid(false);
    return purchaseRepository.save(purchase);
}

    public Optional<Purchase> payPurchase(Long id) {
        Optional<Purchase> purchase = purchaseRepository.findById(id);
        purchase.ifPresent(p -> {
            p.setPaid(true);
            purchaseRepository.save(p);
            rabbitMQProducer.sendPurchasePaidEvent(p.getId(), p.getUserEmail());
        });
        return purchase;
    }
}