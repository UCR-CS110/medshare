## API Responses
API response object structure:
```json
{
  "data": { /* response data */ },
  "error": null
}
```
Use `error` field for error messages.

## API Endpoints
1. **User Authentication**
   - `GET /api/auth/[nextauth]`: Handle user registration, login, and logout using NextAuth.js.
2. **Equipment Management**
   - `GET /api/listings`: Retrieve equipment listings.
   - `POST /api/listings`: Add new equipment listing.
   - `GET /api/listings/:id`: Single listing details.
   - `PATCH /api/listings/:id`: Update listing.
   - `DELETE /api/listings/:id`: Delete listing.
3. **Booking Management**
   - `GET /api/bookings`: Current user's bookings.
   - `POST /api/bookings`: Request a booking.
   - `GET /api/bookings/:id`: Specific booking details.
   - `PATCH /api/bookings/:id`: Update booking status.
   - `DELETE /api/bookings/:id`: Cancel a specific booking.
4. **Review Management**
   - `POST /api/reviews`: Create a new review for a booking.
   - `PATCH /api/reviews/:id`: Update specific review.
   - `DELETE /api/reviews/:id`: Delete a specific review.
5. **User Profile Management**
   - `GET /api/users/:id`: Retrieve details of a specific user.
   - `PATCH /api/users/:id`: Update details of a specific user.