'use client';

import { useState, useEffect } from 'react';
import InteractiveMap from '@/components/map/InteractiveMap';
import StateInfoPanel from '@/components/map/StateInfoPanel';
import { CustomerData, StateInfo } from '@/lib/types';

export default function Home() {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load customer data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/map.json');
        const data: CustomerData[] = await response.json();
        setCustomerData(data);
        
        // Log summary statistics
        const stateSet = new Set(data.map(customer => customer.state).filter(Boolean));
        console.log(`Map loaded: ${stateSet.size} states with customers, ${data.length} total customers`);
      } catch (error) {
        console.error('Error loading customer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStateSelect = (stateInfo: StateInfo) => {
    setSelectedState(stateInfo);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    // Don't reset selectedState immediately to allow for smooth transitions
    setTimeout(() => setSelectedState(null), 300);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-gray-600">Loading customer map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white overflow-hidden font-[family-name:var(--font-asap)]">
      <div 
        className={`w-full h-full transition-all duration-400 ease-out ${
          isPanelOpen ? 'lg:pr-[350px] scale-110' : ''
        }`}
      >
        <InteractiveMap
          customerData={customerData}
          onStateSelect={handleStateSelect}
          selectedStateId={selectedState?.id || null}
        />
      </div>
      
      <StateInfoPanel
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        stateInfo={selectedState}
        customerData={customerData}
      />
    </div>
  );
}
