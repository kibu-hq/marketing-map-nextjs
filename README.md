# Kibu Customer Map

An interactive map displaying Kibu customer locations across the United States. Built with Next.js, D3.js, and Shadcn/ui components.

## Features

- Interactive US map with customer location pins
- State hover effects and tooltips
- Detailed state information panel with customer stories
- Responsive design optimized for embedding

## Data

Customer location data is stored in `public/data/map.json` and updates periodically via automation inside of a Kibu n8n workflow called "Customer States JSON File".

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the map.
