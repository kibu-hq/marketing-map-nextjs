'use client';

import { useState, useEffect } from 'react';
import InteractiveMap from '@/components/map/InteractiveMap';
import StateInfoPanel from '@/components/map/StateInfoPanel';
import { CustomerData, ContentItem, StateInfo, MapDataResponse } from '@/lib/types';

export default function Home() {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load customer and content data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load map data (lat/lng coordinates)
        const mapResponse = await fetch('/data/map.json');
        const mapJson: MapDataResponse[] = await mapResponse.json();
        const mapData: CustomerData[] = mapJson[0]?.coordinates || [];
        setCustomerData(mapData);
        
        // Load content data (blog articles and customer stories)
        const contentResponse = await fetch('/data/content.json');
        const contentData: ContentItem[] = await contentResponse.json();
        setContentData(contentData);
        
        // Log summary statistics
        const stateSet = new Set(mapData.map(customer => customer.state).filter(Boolean));
        console.log(`Map loaded: ${stateSet.size} states with customers, ${mapData.length} total customers`);
        console.log(`Content loaded: ${contentData.length} articles and stories`);
      } catch (error) {
        console.error('Error loading data:', error);
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
    <div 
      className="w-full h-screen bg-white overflow-hidden font-[family-name:var(--font-asap)]"
      onMouseDown={(e) => {
        // Close panel when clicking anywhere except on states or the panel
        // Check if click is on a state path or callout
        const target = e.target as HTMLElement;
        const isStatePath = target.classList.contains('states');
        const isCallout = target.closest('.callout-label') !== null;
        
        if (!isStatePath && !isCallout && isPanelOpen) {
          handlePanelClose();
        }
      }}
    >
      <div 
        className={`w-full h-full transition-all duration-400 ease-out ${
          isPanelOpen ? 'lg:pr-[320px]' : ''
        }`}
      >
        <InteractiveMap
          customerData={customerData}
          onStateSelect={handleStateSelect}
          selectedStateId={selectedState?.id || null}
        />
      </div>
      
      <div onMouseDown={(e) => e.stopPropagation()}>
        <StateInfoPanel
          isOpen={isPanelOpen}
          onClose={handlePanelClose}
          stateInfo={selectedState}
          contentData={contentData}
        />
      </div>
    </div>
  );
}
