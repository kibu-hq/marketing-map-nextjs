export interface CustomerData {
  lat: number;
  lng: number;
  id: string;
  state: string;
  blog_url?: string;
}

export interface StateInfo {
  id: string;
  name: string;
  abbreviation: string;
  count: number;
  emoji: string;
}

export interface CustomerStory {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export interface ContentItem {
  id: string;
  blog_url: string;
  state: string;
  image_url?: string;
  name: string;
  type: string;
}

export interface StateResource {
  title: string;
  url: string;
  imageUrl?: string;
}

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface MapDimensions {
  width: number;
  height: number;
}

export interface StateEmojis {
  [stateName: string]: string;
}

export interface StateNames {
  [stateId: string]: string;
}

export interface StateAbbrevToName {
  [abbreviation: string]: string;
}

export interface StateCounts {
  [stateAbbrev: string]: number;
}

export interface SmallStateConfig {
  id: string;
  abbrev: string;
  name: string;
  labelOffset: {
    x: number;
    y: number;
  };
}

// Simplified types for D3 and GeoJSON data
export interface StateFeature {
  id: string;
  properties?: Record<string, unknown>;
  geometry?: unknown;
  type?: string;
}
