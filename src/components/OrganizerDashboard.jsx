import React, { useState, useEffect } from 'react';

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [price, setPrice] = useState('');

  // Load existing events from Backend API
  const fetchEvents = () => {
    fetch('https://backend-events-b3vi.onrender.com/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
      })
      .catch((err) => console.error("Error fetching events:", err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    
    const newEventData = {
      title,
      description: "Exciting event organized via dashboard.",
      date: "30th Sep 2026",
      location: "Main Auditorium",
      ticketPrice: Number(price),
      totalTickets: Number(totalTickets),
      link: `https://backend-events-b3vi.onrender.com/event/${slug}`
    };

    try {
      const response = await fetch('https://backend-events-b3vi.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEventData),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert("Event successfully created and saved in Database!");
        setShowModal(false);
        setTitle('');
        setTotalTickets('');
        setPrice('');
        fetchEvents(); // Refresh list
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Failed to create event:", err);
      alert("Server error while saving event.");
    }
  };

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard: " + link);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p className="text-sm text-gray-500">Create events and copy shareable links</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow transition"
          >
            + Create New Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{ev.title}</h3>
                <p className="text-xs text-gray-400 mt-1">Price: ₹{ev.ticket_price || ev.ticketPrice}</p>
                <div className="flex justify-between text-sm text-gray-600 mt-4 bg-gray-50 p-3 rounded-lg">
                  <span>Total: <b>{ev.total_tickets || ev.totalTickets}</b></span>
                  <span>Sold: <b className="text-indigo-600">{ev.tickets_sold || ev.ticketsSold || 0}</b></span>
                  <span>Remaining: <b className="text-green-600">{(ev.total_tickets || ev.totalTickets) - (ev.tickets_sold || ev.ticketsSold || 0)}</b></span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <input
                  type="text"
                  readOnly
                  value={ev.link}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-2/3 truncate border"
                />
                <button
                  onClick={() => copyToClipboard(ev.link)}
                  className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-3 py-2 rounded font-medium"
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Code Camp 2026"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Limit (Capacity)</label>
                  <input
                    type="number"
                    required
                    value={totalTickets}
                    onChange={(e) => setTotalTickets(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 199"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    Save & Generate Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
