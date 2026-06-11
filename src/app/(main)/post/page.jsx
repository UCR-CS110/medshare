"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PostEquipmentPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session) return alert("You must be logged in to post equipment.");

    setSubmitting(true);
    setError("");

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, dailyRate: Number(dailyRate), location }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/listings/${data._id}`);
    } else {
      setError(data.error || "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Equipment</h1>
        <p className="text-gray-500 mb-8">Share your medical equipment with people who need it.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Equipment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Standard Foldable Wheelchair"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the equipment, its condition, and any important details..."
              required
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Daily Rate ($)</label>
            <input
              type="number"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              placeholder="e.g. 12"
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Pickup Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Central Medical Hub, Los Angeles CA"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-60"
          >
            {submitting ? "Posting..." : "Post Equipment"}
          </button>
        </form>
      </main>
    </div>
  );
}