package com.example.purchases.controller;

import com.example.purchases.model.Purchase;
import com.example.purchases.service.PurchaseService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping("/create")
    public Purchase create(@RequestBody Purchase purchase) {
        return purchaseService.createPurchase(purchase);
    }

    @PostMapping("/{id}/pagar")
    public Optional<Purchase> pay(@PathVariable Long id) {
        return purchaseService.payPurchase(id);
    }
}  