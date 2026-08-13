import React, { useState } from 'react';
import OrganizerDashboard from './components/OrganizerDashboard';
import EventBookingPage from './components/EventBookingPage';

export default function App() {
  // 'home' -> Main selection page
  // 'organizer' -> Organizer Dashboard
  // 'booking' -> Attendee Booking Page
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      {/* Navigation Header */}
      <nav className="bg-indigo-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 
          onClick={() => setCurrentView('home')} 
          className="text-xl font-bold cursor-pointer tracking-wide"
        >
          🎟️ EventTicketing App
        </h1>
        {currentView !== 'home' && (
          <button
            onClick={() => setCurrentView('home')}
            className="bg-white/20 hover:bg-white/35 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            ← Back to Home
          </button>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
              <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Welcome
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Event Ticket System</h2>
              <p className="text-gray-500 text-sm mb-8">
                Choose what you want to do today: manage your events or book a ticket via shared link.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => setCurrentView('organizer')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition duration-200"
                >
                  🛠️ Create / Manage Events (Organizer)
                </button>

                <button
                  onClick={() => setCurrentView('booking')}
                  className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 px-4 rounded-xl shadow transition duration-200"
                >
                  🔗 Join & Book Event via Link
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'organizer' && <OrganizerDashboard />}
        {currentView === 'booking' && <EventBookingPage />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
        Event Ticket App &copy; 2026 • Built with React & Tailwind
      </footer>
    </div>
  );
}