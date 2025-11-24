package com.hackerrank.sample.domain.valueobject;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Value Object: Money
 * 
 * Encapsulates price/money concept with validation.
 * Immutable and self-validating.
 */
public class Money {
    
    private final BigDecimal amount;
    
    private Money(BigDecimal amount) {
        this.amount = amount;
    }
    
    public static Money of(BigDecimal amount) {
        validateAmount(amount);
        return new Money(amount);
    }
    
    public static Money zero() {
        return new Money(BigDecimal.ZERO);
    }
    
    private static void validateAmount(BigDecimal amount) {
        if (amount == null) {
            throw new IllegalArgumentException("Money amount cannot be null");
        }
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Money amount cannot be negative");
        }
    }
    
    public boolean isGreaterThan(Money other) {
        return this.amount.compareTo(other.amount) > 0;
    }
    
    public boolean isLessThan(Money other) {
        return this.amount.compareTo(other.amount) < 0;
    }
    
    public boolean isZero() {
        return this.amount.compareTo(BigDecimal.ZERO) == 0;
    }
    
    public Money add(Money other) {
        return new Money(this.amount.add(other.amount));
    }
    
    public Money subtract(Money other) {
        return new Money(this.amount.subtract(other.amount));
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Money money = (Money) o;
        return amount.compareTo(money.amount) == 0;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(amount);
    }
    
    @Override
    public String toString() {
        return amount.toString();
    }
}