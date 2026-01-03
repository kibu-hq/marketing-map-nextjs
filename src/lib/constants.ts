import { StateEmojis, StateNames, StateAbbrevToName, SmallStateConfig } from './types';

export const MAP_DIMENSIONS = {
  width: 1056,
  height: 550,
};

export const STATE_EMOJIS: StateEmojis = {
  "Alabama": "🏈", "Alaska": "🐻", "Arizona": "🌵", "Arkansas": "💎", "California": "🌴",
  "Colorado": "🏔️", "Connecticut": "🍂", "Delaware": "🏖️", "District of Columbia": "🏛️",
  "Florida": "🐊", "Georgia": "🍑", "Hawaii": "🌺", "Idaho": "🥔", "Illinois": "🌽",
  "Indiana": "🏁", "Iowa": "🌾", "Kansas": "🌪️", "Kentucky": "🐎", "Louisiana": "🎷",
  "Maine": "🦞", "Maryland": "🦀", "Massachusetts": "⚓", "Michigan": "🚗", "Minnesota": "❄️",
  "Mississippi": "🎵", "Missouri": "🎯", "Montana": "🦬", "Nebraska": "🌽", "Nevada": "🎰",
  "New Hampshire": "🍁", "New Jersey": "🏖️", "New Mexico": "🌶️", "New York": "🗽",
  "North Carolina": "🏀", "North Dakota": "🛢️", "Ohio": "🏭", "Oklahoma": "🛢️",
  "Oregon": "🌲", "Pennsylvania": "🔔", "Rhode Island": "⛵", "South Carolina": "🌴",
  "South Dakota": "🗿", "Tennessee": "🎸", "Texas": "🤠", "Utah": "🏜️", "Vermont": "🍁",
  "Virginia": "🏛️", "Washington": "🍎", "West Virginia": "⛰️", "Wisconsin": "🧀", "Wyoming": "🦌"
};

export const STATE_NAMES: StateNames = {
  "01": "Alabama", "02": "Alaska", "04": "Arizona", "05": "Arkansas", "06": "California",
  "08": "Colorado", "09": "Connecticut", "10": "Delaware", "11": "District of Columbia",
  "12": "Florida", "13": "Georgia", "15": "Hawaii", "16": "Idaho", "17": "Illinois",
  "18": "Indiana", "19": "Iowa", "20": "Kansas", "21": "Kentucky", "22": "Louisiana",
  "23": "Maine", "24": "Maryland", "25": "Massachusetts", "26": "Michigan", "27": "Minnesota",
  "28": "Mississippi", "29": "Missouri", "30": "Montana", "31": "Nebraska", "32": "Nevada",
  "33": "New Hampshire", "34": "New Jersey", "35": "New Mexico", "36": "New York",
  "37": "North Carolina", "38": "North Dakota", "39": "Ohio", "40": "Oklahoma",
  "41": "Oregon", "42": "Pennsylvania", "44": "Rhode Island", "45": "South Carolina",
  "46": "South Dakota", "47": "Tennessee", "48": "Texas", "49": "Utah", "50": "Vermont",
  "51": "Virginia", "53": "Washington", "54": "West Virginia", "55": "Wisconsin", "56": "Wyoming"
};

export const STATE_ABBREV_TO_NAME: StateAbbrevToName = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District of Columbia",
  "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois",
  "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana",
  "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota",
  "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
  "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
  "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
  "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};

export const SMALL_STATES_CONFIG: SmallStateConfig[] = [
  { id: "25", abbrev: "MA", name: "Massachusetts", labelOffset: { x: 60, y: -45 } },
  { id: "44", abbrev: "RI", name: "Rhode Island", labelOffset: { x: 62, y: -20 } },
  { id: "09", abbrev: "CT", name: "Connecticut", labelOffset: { x: 65, y: 10 } },
  { id: "34", abbrev: "NJ", name: "New Jersey", labelOffset: { x: 75, y: 15 } },
  { id: "10", abbrev: "DE", name: "Delaware", labelOffset: { x: 55, y: 22 } },
  { id: "24", abbrev: "MD", name: "Maryland", labelOffset: { x: 65, y: 49 } },
  { id: "11", abbrev: "DC", name: "District of Columbia", labelOffset: { x: 60, y: 75 } }
];

export const TOOLTIP_CONFIG = {
  offset: {
    default: { x: 10, y: -10 },
    callout: { x: -140, y: -40 }
  },
  colors: {
    primary: "#328CFF",
    hover: "#005EFF", 
    selected: "#005EFF",
    default: "#f1f5f9",
    noCustomersHover: "#d1d5db",
    noCustomersSelected: "#d1d5db"
  }
};
