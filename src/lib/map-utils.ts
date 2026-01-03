import { CustomerData, StateInfo, CustomerStory, StateResource, ContentItem, StateCounts, TeamMember, LoveItem, Event } from './types';
import { STATE_NAMES, STATE_ABBREV_TO_NAME, STATE_EMOJIS } from './constants';

export function getStateInfo(stateId: string, stateCounts: StateCounts): StateInfo {
  const stateName = STATE_NAMES[stateId] || "Unknown";
  const stateAbbrev = Object.keys(STATE_ABBREV_TO_NAME).find(key => 
    STATE_ABBREV_TO_NAME[key] === stateName
  );
  const count = stateCounts[stateAbbrev || ''] || 0;
  const emoji = STATE_EMOJIS[stateName] || '🏛️';
  
  return {
    id: stateId,
    name: stateName,
    abbreviation: stateAbbrev || '',
    count,
    emoji
  };
}

export function getCustomerStoriesForState(stateName: string, contentData: ContentItem[]): CustomerStory[] {
  const stateAbbrev = Object.keys(STATE_ABBREV_TO_NAME).find(key => 
    STATE_ABBREV_TO_NAME[key] === stateName
  );
  
  if (!stateAbbrev) return [];
  
  // Get customer stories for this state
  // Criteria: type === "Customer Story"
  const customerStories = contentData.filter(item => 
    (item.state || '').toUpperCase() === stateAbbrev && item.type === "Customer Story"
  );
  
  return customerStories.map(item => ({
    title: item.name,
    url: item.blog_url,
    imageUrl: item.image_url
  }));
}

export function getStateResourcesForState(stateName: string, contentData: ContentItem[]): StateResource[] {
  const stateAbbrev = Object.keys(STATE_ABBREV_TO_NAME).find(key => 
    STATE_ABBREV_TO_NAME[key] === stateName
  );
  
  if (!stateAbbrev) return [];
  
  // State resources are items for this state with type "State Resource"
  const stateResources = contentData.filter(item => 
    (item.state || '').toUpperCase() === stateAbbrev && item.type === "State Resource"
  );
  
  return stateResources.map(item => ({
    title: item.name,
    url: item.blog_url,
    imageUrl: item.image_url
  }));
}

export function calculateStateCounts(customerData: CustomerData[]): StateCounts {
  return customerData.reduce((counts, customer) => {
    if (customer.state) {
      counts[customer.state] = (counts[customer.state] || 0) + 1;
    }
    return counts;
  }, {} as StateCounts);
}

export function getStateColor(count: number, stateId: string | null, selectedStateId: string | null) {
  const colors = {
    primary: "#328CFF",
    selected: "#005EFF",
    default: "#f1f5f9",
    noCustomersSelected: "#d1d5db"
  };

  // If this is the selected state, use selected colors
  if (stateId && stateId === selectedStateId) {
    return count > 0 ? colors.selected : colors.noCustomersSelected;
  }
  // Otherwise use normal colors
  return count > 0 ? colors.primary : colors.default;
}

export function generateTooltipContent(stateName: string, count: number): string {
  return `${stateName}\n${count} customer${count !== 1 ? 's' : ''}`;
}

export function getAccountExecutiveForState(stateName: string, teamData: TeamMember[]): TeamMember | null {
  const stateAbbrev = Object.keys(STATE_ABBREV_TO_NAME).find(key => 
    STATE_ABBREV_TO_NAME[key] === stateName
  );
  
  if (!stateAbbrev) return null;
  
  return teamData.find(member => 
    member.states.includes(stateAbbrev)
  ) || null;
}

export function getLoveForState(stateName: string, loveData: LoveItem[]): LoveItem[] {
  const stateAbbrev = Object.keys(STATE_ABBREV_TO_NAME).find(key => 
    STATE_ABBREV_TO_NAME[key] === stateName
  );

  if (!stateAbbrev) return [];

  return loveData.filter(item => (item.state || '').toUpperCase() === stateAbbrev);
}

export function getEventsForState(stateName: string, eventData: Event[]): Event[] {
  const stateAbbrev = Object.keys(STATE_ABBREV_TO_NAME).find(key => 
    STATE_ABBREV_TO_NAME[key] === stateName
  );

  if (!stateAbbrev) return [];

  // Filter out past events
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

  // Use the state field directly from the event data and filter by date
  return eventData.filter(item => {
    const endDate = new Date(item.end_date);
    return (item.state || '').toUpperCase() === stateAbbrev && endDate >= today;
  });
}
