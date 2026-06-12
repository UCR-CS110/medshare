"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const emptyOverview = {
  counts: { users: 0, listings: 0, bookings: 0, reviews: 0 },
  users: [],
  listings: [],
  bookings: [],
  reviews: [],
};

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function formatMoney(value) {
  if (value === null || value === undefined) return "-";
  return `$${Number(value).toFixed(2)}`;
}

export default function AdminPanel({ initialOverview = emptyOverview }) {
  const [overview, setOverview] = useState(initialOverview);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState("");

  const loadOverview = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/overview");
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load admin data");
      }

      setOverview(payload);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => overview.counts ?? emptyOverview.counts, [overview]);

  const runAction = async (key, url, options = {}) => {
    setBusyKey(key);
    setError("");

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Request failed");
      }

      await loadOverview();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyKey("");
    }
  };

  const updateUser = async (userId, body) => {
    await runAction(`user-${userId}`, `/api/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  };

  const deleteUser = async (userId) => {
    await runAction(`user-delete-${userId}`, `/api/admin/users/${userId}`, {
      method: "DELETE",
    });
  };

  const deleteListing = async (listingId) => {
    await runAction(`listing-${listingId}`, `/api/admin/listings/${listingId}`, {
      method: "DELETE",
    });
  };

  const updateBookingStatus = async (bookingId, status) => {
    await runAction(`booking-${bookingId}-${status}`, `/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  };

  const deleteBooking = async (bookingId) => {
    await runAction(`booking-delete-${bookingId}`, `/api/admin/bookings/${bookingId}`, {
      method: "DELETE",
    });
  };

  const deleteReview = async (reviewId) => {
    await runAction(`review-${reviewId}`, `/api/admin/reviews/${reviewId}`, {
      method: "DELETE",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Admin panel</p>
          <h1 className="text-3xl font-semibold tracking-tight">Database controls</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage users, listings, bookings, and reviews from one place. These actions are restricted to admin accounts.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Back to site</Link>
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Users", value: counts.users },
          { label: "Listings", value: counts.listings },
          { label: "Bookings", value: counts.bookings },
          { label: "Reviews", value: counts.reviews },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-3xl">{loading ? "…" : item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Promote, verify, or remove accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Email</th>
                  <th className="py-3 pr-4 font-medium">Role</th>
                  <th className="py-3 pr-4 font-medium">Verified</th>
                  <th className="py-3 pr-4 font-medium">Provider</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {overview.users.map((user) => (
                  <tr key={user._id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{user.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 pr-4">{user.role}</td>
                    <td className="py-3 pr-4">{user.isVerified ? "Yes" : "No"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{user.providerType || "-"}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyKey === `user-${user._id}`}
                          onClick={() => updateUser(user._id, { role: user.role === "admin" ? "user" : "admin" })}
                        >
                          {user.role === "admin" ? "Demote" : "Make admin"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyKey === `user-${user._id}`}
                          onClick={() => updateUser(user._id, { isVerified: !user.isVerified })}
                        >
                          {user.isVerified ? "Unverify" : "Verify"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busyKey === `user-delete-${user._id}`}
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listings</CardTitle>
          <CardDescription>Remove posts that should not remain live.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Title</th>
                  <th className="py-3 pr-4 font-medium">Seller</th>
                  <th className="py-3 pr-4 font-medium">Location</th>
                  <th className="py-3 pr-4 font-medium">Rate</th>
                  <th className="py-3 pr-4 font-medium">Created</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {overview.listings.map((listing) => (
                  <tr key={listing._id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{listing.title}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{listing.seller?.name || "-"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{listing.location}</td>
                    <td className="py-3 pr-4">{formatMoney(listing.dailyRate)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatDate(listing.createdAt)}</td>
                    <td className="py-3 pr-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busyKey === `listing-${listing._id}`}
                        onClick={() => deleteListing(listing._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Update booking status or remove a booking record.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Listing</th>
                  <th className="py-3 pr-4 font-medium">Renter</th>
                  <th className="py-3 pr-4 font-medium">Dates</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Total</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {overview.bookings.map((booking) => (
                  <tr key={booking._id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{booking.listing?.title || "-"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{booking.renter?.name || "-"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </td>
                    <td className="py-3 pr-4">{booking.status}</td>
                    <td className="py-3 pr-4">{formatMoney(booking.totalPrice)}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        {["pending", "confirmed", "cancelled"].map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={booking.status === status ? "default" : "outline"}
                            disabled={busyKey === `booking-${booking._id}-${status}`}
                            onClick={() => updateBookingStatus(booking._id, status)}
                          >
                            {status}
                          </Button>
                        ))}
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busyKey === `booking-delete-${booking._id}`}
                          onClick={() => deleteBooking(booking._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>Remove reviews that need moderation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Listing</th>
                  <th className="py-3 pr-4 font-medium">Reviewer</th>
                  <th className="py-3 pr-4 font-medium">Rating</th>
                  <th className="py-3 pr-4 font-medium">Comment</th>
                  <th className="py-3 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {overview.reviews.map((review) => (
                  <tr key={review._id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{review.listing?.title || "-"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{review.reviewer?.name || "-"}</td>
                    <td className="py-3 pr-4">{review.rating}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{review.comment || "-"}</td>
                    <td className="py-3 pr-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busyKey === `review-${review._id}`}
                        onClick={() => deleteReview(review._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}