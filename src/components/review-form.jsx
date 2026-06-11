"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export function ReviewForm({ listingId, bookingId, onSubmitted }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session) return alert("You must be logged in to leave a review.");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, bookingId, rating, comment }),
    });

    if (res.ok) {
      setSubmitted(true);
      if (onSubmitted) onSubmitted();
    } else {
      const data = await res.json();
      alert("Error: " + data.error);
    }
  }

  if (submitted) return <p className="text-green-700 font-medium">Review submitted!</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 rounded-xl p-5 bg-white">
      <h3 className="text-lg font-bold text-gray-900">Leave a Review</h3>

      {/* Star rating */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={4}
        className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <button
        type="submit"
        className="w-full py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
}