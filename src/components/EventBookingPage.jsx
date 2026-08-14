import React, { useState, useEffect } from 'react';

export default function EventBookingPage() {
  const [pastedLink, setPastedLink] = useState('');
  const [activeEvent, setActiveEvent] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);
  const [allEvents, setAllEvents] = useState([]);

  // Load events from Render Backend API (Updated URL)
  useEffect(() => {
    fetch('https://backend-events-b3vi.onrender.com/api/events')
      .then((res) => res.json())
      .then((data) => setAllEvents(data))
      .catch((err) => {
        console.error("Error fetching events:", err);
        setAllEvents([
          {
            id: 1,
            title: "Tech Summit 2026",
            description: "Join the biggest tech conference of the year with top industry leaders.",
            date: "25th Aug 2026",
            location: "Auditorium Hall, Delhi",
            ticketPrice: 499,
            totalTickets: 100,
            ticketsSold: 85,
            link: "https://yourdomain.com/event/tech-summit-2026"
          }
        ]);
      });
  }, []);

  // Function to verify and fetch event by link from stored events
  const handleVerifyLink = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    const cleanInputLink = pastedLink.trim().toLowerCase();

    const foundEvent = allEvents.find(
      (ev) => ev.link.toLowerCase() === cleanInputLink || 
              cleanInputLink.includes(ev.title.toLowerCase().replace(/\s+/g, '-'))
    );

    if (foundEvent) {
      setActiveEvent(foundEvent);
    } else {
      setErrorMsg('Invalid or expired event link! Please create an event first or copy the correct link.');
    }
  };

  // Function to handle booking and update ticket count
  const handleBooking = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Update backend database via API (Updated URL)
      fetch(`https://backend-events-b3vi.onrender.com/api/events/${activeEvent.id}/book`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .catch((err) => console.error("Error updating ticket count:", err));

      const updatedEvents = allEvents.map((ev) => {
        if (ev.id === activeEvent.id) {
          return { ...ev, ticketsSold: (ev.ticketsSold || 0) + 1 };
        }
        return ev;
      });
      
      setAllEvents(updatedEvents);

      setSuccessTicket({
        name: buyerName,
        email: buyerEmail,
        eventTitle: activeEvent.title,
        pricePaid: activeEvent.ticketPrice || 499,
        date: activeEvent.date || "Upcoming Date",
        location: activeEvent.location || "Online / Venue",
        ticketId: 'TICKET-' + Math.floor(100000 + Math.random() * 900000)
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        
        {/* Step 1: Link Input Screen */}
        {!activeEvent && !successTicket && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Attendee Portal
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-3 mb-2">Join Event via Link</h2>
            <p className="text-gray-500 text-sm mb-6">
              Paste the shareable link of any event created from the Organizer Dashboard below.
            </p>

            <form onSubmit={handleVerifyLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paste Event Link</label>
                <input
                  type="text"
                  required
                  value={pastedLink}
                  onChange={(e) => setPastedLink(e.target.value)}
                  placeholder="e.g. https://yourdomain.com/event/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                />
              </div>

              {errorMsg && (
                <p className="text-red-600 text-xs font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow transition duration-200"
              >
                Verify & Load Event
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="font-semibold text-gray-700 text-xs mb-2">🔗 Active Event Links in Database:</p>
              <div className="space-y-1">
                {allEvents.map((ev) => (
                  <div key={ev.id} className="text-xs">
                    <span className="font-medium text-gray-800">{ev.title}:</span>
                    <span 
                      onClick={() => setPastedLink(ev.link)} 
                      className="text-indigo-600 hover:underline cursor-pointer block truncate"
                    >
                      {ev.link}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Event Details & Payment Screen */}
        {activeEvent && !successTicket && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-start">
              <div>
                <span className="bg-white/25 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  Verified Event
                </span>
                <h1 className="text-3xl font-bold mt-3">{activeEvent.title}</h1>
                <p className="text-indigo-100 mt-1 text-sm">{activeEvent.date || "Scheduled Soon"} • {activeEvent.location || "Main Arena"}</p>
              </div>
              <button 
                onClick={() => setActiveEvent(null)}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-white"
              >
                Change Link
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-gray-700 font-semibold mb-2">About Event</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{activeEvent.description || "No description provided."}</p>
              </div>

              <div className="flex justify-between items-center bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <div>
                  <p className="text-xs text-gray-500">Fixed Ticket Price</p>
                  <p className="text-2xl font-bold text-indigo-600">₹{activeEvent.ticketPrice || 499}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Availability</p>
                  <p className="text-sm font-semibold text-green-600">
                    {(activeEvent.totalTickets || 100) - (activeEvent.ticketsSold || 0)} Tickets Left
                  </p>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Processing Payment...' : `Pay Exactly ₹{activeEvent.ticketPrice || 499} & Book Ticket`}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {successTicket && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-200 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Ticket Booked Successfully!</h2>
            <p className="text-gray-500 text-sm mb-6">Payment of <b className="text-gray-800">₹{successTicket.pricePaid}</b> received successfully.</p>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left space-y-3 mb-6">
              <div className="flex justify-between text-xs text-gray-500 border-b pb-2">
                <span>Ticket ID:</span>
                <span className="font-mono font-bold text-gray-800">{successTicket.ticketId}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Event</p>
                <p className="font-bold text-gray-800 text-lg">{successTicket.eventTitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-gray-500">Attendee Name</p>
                  <p className="font-semibold text-gray-800 text-sm">{successTicket.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date & Location</p>
                  <p className="font-semibold text-gray-800 text-sm">{successTicket.date}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setSuccessTicket(null); setActiveEvent(null); setPastedLink(''); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-xl transition text-sm"
            >
              Book Another Ticket
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
