'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { CustomerData, StateInfo, StateCounts, Event } from '@/lib/types';
import { MAP_DIMENSIONS, SMALL_STATES_CONFIG, TOOLTIP_CONFIG } from '@/lib/constants';
import { getStateInfo, calculateStateCounts, getStateColor, generateTooltipContent } from '@/lib/map-utils';

interface InteractiveMapProps {
  customerData: CustomerData[];
  onStateSelect: (stateInfo: StateInfo) => void;
  selectedStateId: string | null;
}

export default function InteractiveMap({ customerData, onStateSelect, selectedStateId }: InteractiveMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const [stateCounts, setStateCounts] = useState<StateCounts>({});
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setIsMounted(true);
    fetch(`/data/events.json?v=${new Date().getTime()}`, { cache: 'no-store' })
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error loading events data:', error));
  }, []);

  // Calculate state counts when customer data changes
  useEffect(() => {
    const counts = calculateStateCounts(customerData);
    setStateCounts(counts);
  }, [customerData]);

  // Create hover behavior for states and callouts
  const createHoverBehavior = useCallback((element: d3.Selection<SVGPathElement | SVGGElement, unknown, SVGGElement, unknown>, stateId: string, isCallout = false) => {
    element
      .on("mouseover", function(event) {
        const stateInfo = getStateInfo(stateId, stateCounts);
        
        if (stateId !== selectedStateId) {
          // Highlight the actual state path
          const svg = d3.select(svgRef.current);
          // @ts-ignore - D3 selection types are complex, suppressing for build
          const statePath = svg.selectAll(".states").filter(function(d: any) { return d && d.id === stateId; });
          if (stateInfo.count > 0) {
            statePath.transition().duration(300).ease(d3.easeCubicInOut).attr("fill", TOOLTIP_CONFIG.colors.hover);
          } else {
            statePath.transition().duration(300).ease(d3.easeCubicInOut).attr("fill", TOOLTIP_CONFIG.colors.noCustomersHover);
          }
          
          // Change callout background if this is a callout
          if (isCallout) {
            if (stateInfo.count > 0) {
              d3.select(this).select("rect").transition().duration(300).ease(d3.easeCubicInOut).attr("fill", TOOLTIP_CONFIG.colors.hover);
            } else {
              d3.select(this).select("rect").transition().duration(300).ease(d3.easeCubicInOut).attr("fill", TOOLTIP_CONFIG.colors.noCustomersHover);
            }
          }
        }
        
        // Show tooltip with smart positioning
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          
          // Smart offset calculation
          let offsetX, offsetY;
          if (isCallout) {
            // For callouts, position above and to the left to avoid overlap
            offsetX = -120;
            offsetY = -50;
          } else {
            // For regular states, position to the right and slightly up
            offsetX = 15;
            offsetY = -10;
          }
          
          tooltip
            .style("opacity", 1)
            .html(generateTooltipContent(stateInfo.name, stateInfo.count))
            .style("left", (event.pageX + offsetX) + "px")
            .style("top", (event.pageY + offsetY) + "px");
        }
      })
      .on("mousemove", function(event) {
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          
          // Smart offset calculation for move events too
          let offsetX, offsetY;
          if (isCallout) {
            offsetX = -120;
            offsetY = -50;
          } else {
            offsetX = 15;
            offsetY = -10;
          }
          
          tooltip
            .style("left", (event.pageX + offsetX) + "px")
            .style("top", (event.pageY + offsetY) + "px");
        }
      })
      .on("mouseout", function() {
        const stateInfo = getStateInfo(stateId, stateCounts);
        
        // Don't reset color if this is the currently selected state
        if (stateId !== selectedStateId) {
          // Reset state color
          const svg = d3.select(svgRef.current);
          // @ts-ignore - D3 selection types are complex, suppressing for build
          const statePath = svg.selectAll(".states").filter(function(d: any) { return d && d.id === stateId; });
          statePath.transition().duration(300).ease(d3.easeCubicInOut).attr("fill", getStateColor(stateInfo.count, stateId, selectedStateId));
          
          // Reset callout background if this is a callout
          if (isCallout) {
            d3.select(this).select("rect").transition().duration(300).ease(d3.easeCubicInOut).attr("fill", stateInfo.count > 0 ? TOOLTIP_CONFIG.colors.primary : "white");
          }
        }
        
        // Hide tooltip
        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style("opacity", 0);
        }
      });
  }, [stateCounts, selectedStateId]);

  // Update state colors
  const updateStateColors = useCallback(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll(".states")
      .attr("fill", function(d: unknown) {
        if (!d || !(d as {id: string}).id) return "#f1f5f9";
        const stateInfo = getStateInfo((d as {id: string}).id, stateCounts);
        return getStateColor(stateInfo.count, (d as {id: string}).id, selectedStateId);
      });
  }, [stateCounts, selectedStateId]);

  // Add customer pins
  const addCustomerPins = useCallback((svg: d3.Selection<SVGSVGElement | SVGGElement, unknown, null, undefined>, projection: d3.GeoProjection) => {
    const validCustomers = customerData.filter(d => {
      if (d.lat === null || d.lng === null || 
          d.lat === undefined || d.lng === undefined ||
          isNaN(d.lat) || isNaN(d.lng)) {
        return false;
      }
      
      const projected = projection([d.lng, d.lat]);
      return projected !== null;
    });
    
    svg.selectAll(".customer-pin")
      .data(validCustomers)
      .enter().append("circle")
      .attr("class", "customer-pin")
      .attr("cx", d => {
        const projected = projection([d.lng, d.lat]);
        return projected![0];
      })
      .attr("cy", d => {
        const projected = projection([d.lng, d.lat]);
        return projected![1];
      })
      .attr("r", 3)
      .attr("fill", "#ffffff")
      .attr("stroke", "#000000")
      .attr("stroke-width", 1)
      .style("opacity", 1)
      .style("pointer-events", "none")
      .style("z-index", 1000);
  }, [customerData]);

  // Add event pins
  const addEventPins = useCallback((svg: d3.Selection<SVGSVGElement | SVGGElement, unknown, null, undefined>, projection: d3.GeoProjection) => {
    const validEvents = events.filter(d => {
      const lat = parseFloat(d.latitude);
      const lon = parseFloat(d.longitude);

      if (isNaN(lat) || isNaN(lon)) {
        return false;
      }

      const projected = projection([lon, lat]);
      return projected !== null;
    });

    // Create a group for event pins to ensure proper layering
    const eventPinsGroup = svg.append("g").attr("class", "event-pins-group");
    
    eventPinsGroup.selectAll(".event-pin")
      .data(validEvents)
      .enter().append("circle")
      .attr("class", "event-pin")
      .attr("cx", d => {
        const projected = projection([parseFloat(d.longitude), parseFloat(d.latitude)]);
        return projected![0];
      })
      .attr("cy", d => {
        const projected = projection([parseFloat(d.longitude), parseFloat(d.latitude)]);
        return projected![1];
      })
      .attr("r", 6)
      .attr("fill", "#FF6600") // Brighter orange
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .style("opacity", 1)
      .style("pointer-events", "none");
    
    // Add pulsing animation using D3 transitions
    function pulse(selection: any) {
      selection
        .transition()
        .duration(1000)
        .ease(d3.easeSinInOut)
        .attr("r", 7)
        .style("opacity", 0.9)
        .transition()
        .duration(1000)
        .ease(d3.easeSinInOut)
        .attr("r", 6)
        .style("opacity", 1)
        .on("end", function(this: SVGCircleElement) {
          pulse(d3.select(this));
        });
    }
    
    // Start pulsing animation for all event pins
    eventPinsGroup.selectAll(".event-pin").call(pulse);
  }, [events]);

  // Draw callouts for small East Coast states
  const drawCallouts = useCallback((svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, states: unknown[], projection: d3.GeoProjection, path: d3.GeoPath) => {
    const calloutsGroup = svg.append("g").attr("class", "callouts");
    
    SMALL_STATES_CONFIG.forEach(config => {
      const stateFeature = states.find(d => (d as {id: string}).id === config.id);
      if (!stateFeature) return;
      
      const centroid = path.centroid(stateFeature as any);
      if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return;
      
      const labelX = centroid[0] + config.labelOffset.x;
      const labelY = centroid[1] + config.labelOffset.y;
      
      // Draw leader line
      calloutsGroup.append("line")
        .attr("class", "leader-line")
        .attr("x1", centroid[0])
        .attr("y1", centroid[1])
        .attr("x2", labelX)
        .attr("y2", labelY)
        .attr("stroke", "#666")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");
      
      // Draw label
      const labelGroup = calloutsGroup.append("g")
        .attr("class", "callout-label")
        .attr("data-state-id", config.id);
      
      const labelText = labelGroup.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "12px")
        .attr("font-weight", "800")
        .attr("pointer-events", "all")
        .style("cursor", "pointer")
        .attr("fill", () => {
          const stateInfo = getStateInfo(config.id, stateCounts);
          return stateInfo.count > 0 ? "white" : "#374151";
        })
        .text(config.abbrev);
      
      // Add background rectangle
      const bbox = (labelText.node() as SVGTextElement).getBBox();
      const padding = 4;
      
      labelGroup.insert("rect", "text")
        .attr("x", bbox.x - padding)
        .attr("y", bbox.y - padding)
        .attr("width", bbox.width + 2 * padding)
        .attr("height", bbox.height + 2 * padding)
        .attr("rx", 3)
        .attr("fill", () => {
          const stateInfo = getStateInfo(config.id, stateCounts);
          return stateInfo.count > 0 ? TOOLTIP_CONFIG.colors.primary : "white";
        })
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1)
        .attr("pointer-events", "all")
        .style("cursor", "pointer");
      
      // Add hover and click events
      // @ts-expect-error - D3 selection types are complex, suppressing for build
      createHoverBehavior(labelGroup, config.id, true);
      
      labelGroup.on("click", function() {
        const stateInfo = getStateInfo(config.id, stateCounts);
        onStateSelect(stateInfo);
      });
    });
  }, [createHoverBehavior, stateCounts, onStateSelect]);

  // Initialize map
  useEffect(() => {
    if (!svgRef.current || isMapLoaded || !isMounted) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const projection = d3.geoAlbersUsa()
      .scale(1000)
      .translate([MAP_DIMENSIONS.width / 2, MAP_DIMENSIONS.height / 2]);

    const path = d3.geoPath().projection(projection);

    // Load US map data
    projectionRef.current = projection;

    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then((us: unknown) => {
      const statesFeature = topojson.feature(us as any, (us as any).objects.states) as any;
      const states = statesFeature.features;
      
      // Draw states
      svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(states)
        .enter().append("path")
        .attr("d", (d: unknown) => path(d as any))
        .attr("class", "states")
        .attr("fill", function(d: unknown) {
          if (!d || !(d as {id: string}).id) return "#f1f5f9";
          const stateInfo = getStateInfo((d as {id: string}).id, stateCounts);
          return getStateColor(stateInfo.count, (d as {id: string}).id, selectedStateId);
        })
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 0.8)
        .style("cursor", "pointer")
        .each(function(d: unknown) {
          // @ts-expect-error - D3 selection types are complex, suppressing for build
          createHoverBehavior(d3.select(this), (d as {id: string}).id, false);
        })
        .on("click", function(event, d: unknown) {
          const stateInfo = getStateInfo((d as {id: string}).id, stateCounts);
          onStateSelect(stateInfo);
        });
      
      // Draw state borders
      svg.append("path")
        .datum(topojson.mesh(us as any, (us as any).objects.states, (a: unknown, b: unknown) => a !== b))
        .attr("class", "state-borders")
        .attr("d", (d: unknown) => path(d as any))
        .attr("fill", "none")
        .attr("stroke", "#9ca3af")
        .attr("stroke-width", 0.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("pointer-events", "none");
      
      // Draw callouts
      drawCallouts(svg, states, projection, path);
      
      // Create a pins group to ensure all pins are above map elements
      const pinsGroup = svg.append("g").attr("class", "all-pins-group");
      
      // Add customer pins to the pins group
      addCustomerPins(pinsGroup, projection);

      
      setIsMapLoaded(true);
    });
  }, [createHoverBehavior, drawCallouts, addCustomerPins, stateCounts, onStateSelect, isMapLoaded, isMounted]);

  // Update colors when state counts or selection changes
  useEffect(() => {
    if (isMapLoaded) {
      updateStateColors();
    }
  }, [stateCounts, selectedStateId, updateStateColors, isMapLoaded]);

  // Draw event pins when events data changes
  useEffect(() => {
    if (!isMapLoaded || !projectionRef.current || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const pinsGroup = svg.select<SVGGElement>(".all-pins-group");

    if (!pinsGroup.empty()) {
      // Clear existing event pins before drawing new ones
      pinsGroup.selectAll(".event-pins-group").remove();
      addEventPins(pinsGroup, projectionRef.current);
    }
  }, [events, isMapLoaded, addEventPins]);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <svg
        ref={svgRef}
        width={MAP_DIMENSIONS.width}
        height={MAP_DIMENSIONS.height}
        viewBox={`0 0 ${MAP_DIMENSIONS.width} ${MAP_DIMENSIONS.height}`}
        className="w-full h-auto max-w-full max-h-full transition-all duration-400"
      />
      <div
        ref={tooltipRef}
        className="absolute bg-black/80 text-white px-3 py-2 rounded text-sm pointer-events-none opacity-0 transition-opacity duration-200 z-50 whitespace-pre-line"
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      />
    </div>
  );
}
