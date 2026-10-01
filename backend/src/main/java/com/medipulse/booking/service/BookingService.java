package com.medipulse.booking.service;

import com.medipulse.booking.dto.BookingRequestDto;
import com.medipulse.booking.dto.BookingResponseDto;

public interface BookingService {

    /**
     * Executes resource reservation with optimistic concurrency control
     * and transactional outbox event creation.
     *
     * @param request Booking request payload
     * @return Confirmed booking response
     * @throws com.medipulse.common.exception.BookingConflictException if stock is exhausted or concurrent update conflicts
     */
    BookingResponseDto createBooking(BookingRequestDto request);

    /**
     * Retrieves confirmed booking details by unique reference token.
     */
    BookingResponseDto getBookingByReference(String bookingReference);
}
