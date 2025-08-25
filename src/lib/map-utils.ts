import { CustomerData, StateInfo, CustomerStory, StateCounts } from './types';
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

export function getCustomerStoriesForState(stateName: string, customerData: CustomerData[]): CustomerStory[] {
  const stateAbbrev = Object.keys(STATE_ABBREV_TO_NAME).find(key => 
    STATE_ABBREV_TO_NAME[key] === stateName
  );
  
  if (!stateAbbrev) return [];
  
  // Get customers with blog URLs for this state
  const customersWithBlogs = customerData.filter(customer => 
    customer.state === stateAbbrev && customer.blog_url
  );
  
  // Extract blog titles from URLs and create story objects
  return customersWithBlogs.map(customer => {
    const urlParts = customer.blog_url!.split('/');
    const slug = urlParts[urlParts.length - 1];
    const title = slug.replace(/-/g, ' ')
      .replace(/customer stories /i, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      title: title,
      description: "Read about how this organization uses Kibu.",
      url: customer.blog_url!
    };
  });
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
