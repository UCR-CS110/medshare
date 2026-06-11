"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ReviewForm } from "@/components/review-form";

function Placeholder({ className = "", label = "Image" }) {
  return (
    <div className={`bg-gray-200 flex items-center justify-center text-gray-400 text-sm ${className}`}>
      {label}
    </div>
  );
}

function ImageGallery() {
  const [activeThumb, setActiveThumb] = useState(0);
  return (
    <div className="space-y-3">
      <Placeholder className="w-full aspect-4/3 rounded-xl border border-gray-200 text-base" label="Main Image" />
      <div className="grid grid-cols-4 gap-2">
        {["View 1", "View 2", "View 3", "+2 More"].map((label, i) => (
          <div
            key={i}
            onClick={() => setActiveThumb(i)}
            className={`aspect-square rounded-lg border-2 cursor-pointer flex items-center justify-center bg-gray-200 text-gray-400 text-xs transition-colors ${
              activeThumb === i ? "border-green-700" : "border-gray-200 hover:border-gray-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingBox({ listing }) {
  const { data: session } = useSession();
  const [requested, setRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(() => {
    const start = new Date();
    start.setDate(start.getDate());
    return start.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const end = new Date();
    end.setDate(end.getDate() + 1);
    return end.toISOString().slice(0, 10);
  });

  async function handleRequest() {
    if (!session?.user?.id) {
      setError("Please sign in to request this equipment.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing?._id,
          startDate,
          endDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to send request.");
        return;
      }

      setRequested(true);
    } catch {
      setError("Unable to send request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
      <div className="flex justify-between pb-3 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Daily Rate</p>
          <p className="text-2xl font-bold text-green-800">
            ${listing?.dailyRate} <span className="text-sm font-normal text-gray-400">/day</span>
          </p>
        </div>
      </div>
      <div className="space-y-1.5 text-sm text-gray-600">
        <p>Pickup: <strong className="text-gray-900">{listing?.location}</strong></p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="space-y-1">
          <span className="block text-xs font-medium text-gray-500">Start date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </label>
        <label className="space-y-1">
          <span className="block text-xs font-medium text-gray-500">End date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </label>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleRequest}
          disabled={requested || submitting}
          className={`w-full py-3 rounded-lg text-white font-semibold text-base transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
            requested ? "bg-teal-700" : "bg-green-700 hover:bg-green-800"
          }`}
        >
          {requested ? "Request Sent!" : submitting ? "Sending..." : "Request to Borrow"}
        </button>
        <button className="w-full py-2.5 rounded-lg border border-green-700 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors">
          Message Provider
        </button>
      </div>
    </div>
  );
}

function ProductDetails({ listing, avgRating, reviewCount }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{listing?.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          {avgRating ? (
            <>
              <span className="text-yellow-400 text-sm">
                {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}
              </span>
              <span className="text-sm text-gray-500">
                {avgRating} · {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400">No reviews yet</span>
          )}
        </div>
      </div>
      <PricingBox listing={listing} />
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Equipment Description</p>
        <p className="text-sm text-gray-600 leading-relaxed">{listing?.description}</p>
      </div>
    </div>
  );
}

function ProviderSection({ seller }) {
  return (
    <section className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">About the Provider</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start">
        <Placeholder className="w-16 h-16 rounded-full shrink-0 border border-gray-200 text-xs" label="Photo" />
        <div className="flex-1 space-y-1">
          <p className="font-bold text-gray-900">{seller?.name ?? "Provider"}</p>
          <p className="text-sm text-gray-500">{seller?.bio || "No bio available."}</p>
        </div>
      </div>
    </section>
  );
}

function ReviewsList({ reviews }) {
  if (reviews.length === 0) return <p className="text-sm text-gray-400">No reviews yet.</p>;
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900 text-sm">{review.reviewer?.name ?? "Anonymous"}</p>
            <p className="text-yellow-500 text-sm">
              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
            </p>
          </div>
          <p className="text-sm text-gray-600">{review.comment}</p>
          <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default function ListingDetailPage({ params }) {
  const { id } = use(params);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  function fetchReviews() {
    fetch(`/api/reviews?listingId=${id}`)
      .then(r => r.json())
      .then(data => {
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        setAvgRating(data.avgRating);
        setReviewCount(data.count);
      });
  }

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(r => r.json())
      .then(data => {
        setListing(data);
        setLoading(false);
      });

    fetchReviews();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-400">Loading...</div>;
  if (!listing || listing.error) return <div className="p-10 text-center text-red-400">Listing not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-sm text-gray-400 mb-6">
          <Link href="/search" className="text-green-700 hover:underline">Marketplace</Link>
          {" › "}
          <span className="text-gray-700">{listing.title}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ImageGallery />
          <ProductDetails listing={listing} avgRating={avgRating} reviewCount={reviewCount} />
        </div>

        <ProviderSection seller={listing.seller} />

        <section className="mt-10 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
          <ReviewsList reviews={reviews} />
          <div className="mt-6">
            <ReviewForm listingId={id} onSubmitted={fetchReviews} />
          </div>
        </section>
      </main>
    </div>
  );
}