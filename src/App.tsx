import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Education from './components/Education';
import Medications from './components/Medications';
import AdvancedCare from './components/AdvancedCare';
import Contacts from './components/Contacts';
import Settings from './components/Settings';
import { useHeartHome } from './hooks/useHeartHome';
import { Loader2 } from 'lucide-react';
import CheckInForm from './components/CheckInForm';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const { profile, isReady } = useHeartHome();

  if (!isReady) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg-base text-brand-dark space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-green" />
        <p className="font-serif italic text-xl">Preparing your HeartHome...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'checkin':
        return (
          <div className="max-w-xl mx-auto py-8">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-serif text-brand-dark">Daily Check-in</h2>
              <p className="text-text-muted mt-2">Consistent tracking is the heart of management.</p>
            </div>
            <CheckInForm 
              mode={profile?.trackingMode || 'basic'} 
              onComplete={() => setActiveTab('dashboard')} 
            />
          </div>
        );
      case 'education':
        return <Education />;
      case 'meds':
        return <Medications />;
      case 'advanced':
        return <AdvancedCare />;
      case 'contacts':
        return <Contacts />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
