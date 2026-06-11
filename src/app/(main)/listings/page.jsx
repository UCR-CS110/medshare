"use client";

import { useState } from "react";
import Link from "next/link";
import { ReviewForm } from "@/components/review-form";

// Placeholder box component to replace images
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

function PricingBox() {
  const [requested, setRequested] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
      <div className="flex justify-between pb-3 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Daily Rate</p>
          <p className="text-2xl font-bold text-green-800">
            $12.00 <span className="text-sm font-normal text-gray-400">/day</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Monthly Plan</p>
          <p className="text-2xl font-bold text-teal-700">
            $180.00 <span className="text-sm font-normal text-gray-400">/mo</span>
          </p>
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-gray-600">
        <p> Available from: <strong className="text-gray-900">Today</strong></p>
        <p> Pickup: <strong className="text-gray-900">Central Medical Hub (2.4 miles)</strong></p>
      </div>

      <div className="space-y-2 pt-1">
        <button
          onClick={() => setRequested(true)}
          className={`w-full py-3 rounded-lg text-white font-semibold text-base transition-colors ${
            requested ? "bg-teal-700" : "bg-green-700 hover:bg-green-800"
          }`}
        >
          {requested ? "Request Sent!" : "Request to Borrow"}
        </button>
        <button className="w-full py-2.5 rounded-lg border border-green-700 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors">
          Message Provider
        </button>
      </div>
    </div>
  );
}

function ProductDetails() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
            Verified Provider
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">
          Excellent Condition
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Standard Foldable Wheelchair</h1>
        <p className="text-sm text-gray-400 mt-1">★★★★☆ 4.8 · 124 Borrowings</p>
      </div>

      <PricingBox />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Equipment Description</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Lightweight, durable wheelchair for clinical and home use. High-grade steel frame folds compactly. Breathable nylon upholstery for long-term comfort.
        </p>
        <div className="grid grid-cols-2 gap-y-2 mt-2">
          {["Max Weight: 250 lbs", "Weight: 34 lbs", "Swing-away footrests", "Sanitized Guarantee"].map((spec) => (
            <p key={spec} className="text-sm text-gray-600 flex items-center gap-1.5">
              <span className="text-green-600"></span> {spec}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProviderSection() {
  return (
    <section className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">About the Provider</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start">
        <Placeholder className="w-16 h-16 rounded-full shrink-0 border border-gray-200 text-xs" label="Photo" />
        <div className="flex-1 space-y-1">
          <p className="font-bold text-gray-900">Dr. John Doe</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Physical therapist with 15+ years of experience. Provides vetted, high-quality mobility equipment for home-based patients.
          </p>
          <div className="flex gap-6 pt-2">
            {[["4.9", "Rating"], ["850+", "Items Shared"], ["2h", "Response Time"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-lg font-bold text-green-800">{val}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="shrink-0 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          View Profile
        </button>
      </div>
    </section>
  );
}

const similarItems = [
  { id: 1, title: "Adjustable 4-Wheel Walker", price: "$8.00/day" },
  { id: 2, title: "Forearm Crutches", price: "$5.00/day" },
  { id: 3, title: "Ultra-Light Transport Chair", price: "$10.00/day" },
  { id: 4, title: "Stability Quad Cane", price: "$3.00/day" },
];

function SimilarItems() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Mobility Aids</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {similarItems.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Placeholder className="w-full aspect-4/3 text-xs" label="Image" />
            <div className="p-3 space-y-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
              <p className="text-base font-bold text-green-800">{item.price}</p>
              <Link
                href={`/listings/${item.id}`}
                className="block w-full mt-1 py-1.5 text-xs font-medium text-center bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Quick View
              </Link>
            </div>
          </div>
        ))}
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
            <p className="text-yellow-500 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
          </div>
          <p className="text-sm text-gray-600">{review.comment}</p>
          <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default function ListingDetailPage() {
  const [reviews, setReviews] = useState([]);

useEffect(() => {
  fetch(`/api/listings/${id}`)
    .then(r => r.json())
    .then(data => {
      setListing(data);
      setLoading(false);
    });

  fetch(`/api/reviews?listingId=${id}`)
  .then(r => r.json())
  .then(data => {
    setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    setAvgRating(data.avgRating);
    setReviewCount(data.count);
  });
}, [id]);

  return (
    <section className="mt-10 pt-8 border-t border-gray-200">
  <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
  <ReviewsList reviews={reviews} />
  <div className="mt-6">
    <ReviewForm listingId={id} onSubmitted={() => {
      fetch(`/api/reviews?listingId=${id}`)
        .then(r => r.json())
        .then(data => setReviews(Array.isArray(data) ? data : []));
    }} />
  </div>
</section>
  );
}