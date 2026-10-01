package com.medipulse.booking.controller;

import com.medipulse.booking.dto.BookingRequestDto;
import com.medipulse.booking.dto.BookingResponseDto;
import com.medipulse.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Confirms a resource reservation with optimistic locking and writes
     * notification intent to the transactional outbox.
     */
    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@Valid @RequestBody BookingRequestDto request) {
        BookingResponseDto response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Fetches booking details by unique reference token.
     */
    @GetMapping("/{bookingReference}")
    public ResponseEntity<BookingResponseDto> getBooking(@PathVariable String bookingReference) {
        BookingResponseDto response = bookingService.getBookingByReference(bookingReference);
        return ResponseEntity.ok(response);
    }
}
