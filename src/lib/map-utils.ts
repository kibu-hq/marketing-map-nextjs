import { CustomerData, StateInfo, CustomerStory, StateResource, ContentItem, StateCounts } from './types';
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
  // Criteria: item.id is non-empty
  const customerStories = contentData.filter(item => 
    (item.state || '').toUpperCase() === stateAbbrev && !!(item.id && item.id.trim().length > 0)
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
  
  // State resources are items for this state where id is empty
  const stateResources = contentData.filter(item => {
    if ((item.state || '').toUpperCase() !== stateAbbrev) return false;
    const isStory = !!(item.id && item.id.trim().length > 0);
    return !isStory;
  });
  
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
