"use client";

import React, { useEffect, useState } from "react";
import { Search, Plus, X, MapPin, Tag, Package } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = ["All", "Electronics", "Clothing", "Furniture", "Vehicles", "Books", "Sports", "Other"];

const DEMO_LISTINGS = [
  { _id: "d1", title: "iPhone 14 Pro", description: "Excellent condition, 256GB, Space Black", price: 750, category: "Electronics", condition: "Like New", location: "Cairo", images: ["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400"], seller: { firstName: "Ahmed", lastName: "Ali", username: "ahmedali", profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" }, createdAt: new Date().toISOString() },
  { _id: "d2", title: "MacBook Pro M2", description: "2023 model, 16GB RAM, 512GB SSD", price: 1400, category: "Electronics", condition: "Like New", location: "Alexandria", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"], seller: { firstName: "Sara", lastName: "Hassan", username: "sarahassan", profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" }, createdAt: new Date().toISOString() },
  { _id: "d3", title: "Vintage Leather Sofa", description: "Brown leather, 3-seater, great condition", price: 320, category: "Furniture", condition: "Good", location: "Giza", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"], seller: { firstName: "Omar", lastName: "Khaled", username: "omarkhaled", profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" }, createdAt: new Date().toISOString() },
  { _id: "d4", title: "Nike Air Max 270", description: "Size 42, worn twice, original box", price: 85, category: "Clothing", condition: "Like New", location: "Cairo", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"], seller: { firstName: "Lina", lastName: "Farouk", username: "linafarouk", profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" }, createdAt: new Date().toISOString() },
  { _id: "d5", title: "Mountain Bike Trek", description: "21-speed, aluminum frame, front suspension", price: 280, category: "Sports", condition: "Good", location: "Alexandria", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"], seller: { firstName: "Karim", lastName: "Nasser", username: "karimnasser", profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" }, createdAt: new Date().toISOString() },
  { _id: "d6", title: "Clean Code - Book", description: "Robert C. Martin, paperback, like new", price: 15, category: "Books", condition: "Like New", location: "Cairo", images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"], seller: { firstName: "Maya", lastName: "Chen", username: "mayachen", profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" }, createdAt: new Date().toISOString() },
];

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  images: string[];
  seller: { firstName: string; lastName: string; username: string; profilePicture?: string };
  createdAt: string;
}

const CONDITION_COLORS: Record<string, string> = {
  "New": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  "Like New": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  "Good": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  "Fair": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
};

export default function MarketplacePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>(DEMO_LISTINGS as any);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "Electronics", condition: "Good", location: "", images: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchListings(); }, [category]);

  const fetchListings = async () => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    const res = await apiRequest(`/marketplace?${params}`);
    if (res.success && res.data?.length > 0) setListings(res.data);
  };

  const filtered = listings.filter((l) => {
    const matchCat = category === "All" || l.category === category;
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const res = await apiRequest("/marketplace", {
      method: "POST",
      body: {
        ...form,
        price: Number(form.price),
        images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
      },
    });
    if (res.success) {
      setListings((prev) => [res.data, ...prev]);
      setShowCreate(false);
      setForm({ title: "", description: "", price: "", category: "Electronics", condition: "Good", location: "", images: "" });
    }
    setCreating(false);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Top Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search marketplace..."
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Sell Item
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition ${category === cat ? "bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700/50">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No listings found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((listing) => (
              <div
                key={listing._id}
                onClick={() => setSelectedListing(listing)}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {listing.images?.[0] ? (
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Package className="w-10 h-10" /></div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{listing.title}</p>
                  <p className="text-blue-600 dark:text-blue-400 font-extrabold text-base mt-0.5">${listing.price}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CONDITION_COLORS[listing.condition] || ""}`}>{listing.condition}</span>
                    {listing.location && (
                      <span className="flex items-center gap-0.5 text-[10px] text-gray-400"><MapPin className="w-3 h-3" />{listing.location}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedListing(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {selectedListing.images?.[0] && (
              <div className="h-64 overflow-hidden">
                <img src={selectedListing.images[0]} alt={selectedListing.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">{selectedListing.title}</h2>
                  <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">${selectedListing.price}</p>
                </div>
                <button onClick={() => setSelectedListing(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{selectedListing.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full"><Tag className="w-3 h-3" />{selectedListing.category}</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CONDITION_COLORS[selectedListing.condition] || ""}`}>{selectedListing.condition}</span>
                {selectedListing.location && <span className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full"><MapPin className="w-3 h-3" />{selectedListing.location}</span>}
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <img src={selectedListing.seller.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} className="w-9 h-9 rounded-full object-cover" alt={selectedListing.seller.firstName} />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedListing.seller.firstName} {selectedListing.seller.lastName}</p>
                  <p className="text-xs text-gray-400">@{selectedListing.seller.username}</p>
                </div>
                <button className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
                  Message Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-gray-900 dark:text-gray-100">Sell an Item</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              {[
                { name: "title", label: "Title", type: "text", placeholder: "What are you selling?" },
                { name: "price", label: "Price ($)", type: "number", placeholder: "0" },
                { name: "location", label: "Location", type: "text", placeholder: "City" },
                { name: "images", label: "Image URL", type: "text", placeholder: "https://..." },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    required={f.name !== "images" && f.name !== "location"}
                    placeholder={f.placeholder}
                    value={(form as any)[f.name]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your item..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100">
                    {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Condition</label>
                  <select value={form.condition} onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value }))} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100">
                    {["New", "Like New", "Good", "Fair"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={creating} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition mt-1">
                {creating ? "Posting..." : "Post Listing"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
