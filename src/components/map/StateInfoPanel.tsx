'use client';

import { StateInfo, ContentItem, TeamMember, LoveItem, Event } from '@/lib/types';
import { getCustomerStoriesForState, getStateResourcesForState, getAccountExecutiveForState, getLoveForState, getEventsForState } from '@/lib/map-utils';
import EventCard from '@/components/ui/EventCard';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import OrgLogoPlaceholder from '@/components/ui/org-logo-placeholder';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, ArrowUpRight, Megaphone } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StateInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stateInfo: StateInfo | null;
  contentData: ContentItem[];
}

export default function StateInfoPanel({ isOpen, onClose, stateInfo, contentData }: StateInfoPanelProps) {
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [loveData, setLoveData] = useState<LoveItem[]>([]);
  const [eventData, setEventData] = useState<Event[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load team data
    fetch(`/data/team.json?v=${new Date().getTime()}`, { cache: 'no-store' })
      .then(response => response.json())
      .then(data => setTeamData(data))
      .catch(error => console.error('Error loading team data:', error));

    // Load love data
    fetch(`/data/love.json?v=${new Date().getTime()}`, { cache: 'no-store' })
      .then(response => response.json())
      .then(data => setLoveData(data))
      .catch(error => console.error('Error loading love data:', error));

    // Load event data
    fetch(`/data/events.json?v=${new Date().getTime()}`, { cache: 'no-store' })
      .then(response => response.json())
      .then(data => setEventData(data))
      .catch(error => console.error('Error loading event data:', error));
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [isOpen]);

  const customerStories = useMemo(() => stateInfo ? getCustomerStoriesForState(stateInfo.name, contentData) : [], [stateInfo, contentData]);
  const stateResources = useMemo(() => stateInfo ? getStateResourcesForState(stateInfo.name, contentData) : [], [stateInfo, contentData]);
  const accountExecutive = useMemo(() => stateInfo ? getAccountExecutiveForState(stateInfo.name, teamData) : null, [stateInfo, teamData]);
  const loveForState = useMemo(() => stateInfo ? getLoveForState(stateInfo.name, loveData) : [], [stateInfo, loveData]);
  const eventsForState = useMemo(() => stateInfo ? getEventsForState(stateInfo.name, eventData) : [], [stateInfo, eventData]);

  if (!stateInfo) return null;

  const handleScheduleClick = (url: string) => {
    if ((window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: `${url}?hide_gdpr_banner=1`,
      });
    }
    return false;
  };

  // Check if this state has zero customers
  const hasNoCustomers = stateInfo.count === 0;

  return (
    <Sheet open={isOpen} onOpenChange={() => {}} modal={false}>
      <SheetContent className="w-[400px] sm:w-[400px] md:w-[400px] lg:w-[400px] h-full bg-white border-l border-gray-200 shadow-2xl data-[state=open]:slide-in-from-right-0 data-[state=closed]:slide-out-to-right-0 [&>button]:hidden flex flex-col will-change-transform">
        <SheetHeader className="pb-6 border-b border-black/8 bg-gradient-to-br from-blue-500/5 to-white/10 p-6 pt-8">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-3xl leading-none">{stateInfo.emoji}</span>
              {stateInfo.name}
            </SheetTitle>
            <SheetDescription className="sr-only">
              View customer information and stories for {stateInfo.name}
            </SheetDescription>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-black/5 flex items-center justify-center cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-4xl font-bold text-blue-500 leading-none">
              {stateInfo.count}
            </span>
            <span className="text-sm text-gray-600 font-medium">
              Kibu {stateInfo.count === 1 ? 'customer' : 'customers'}
            </span>
          </div>
        </SheetHeader>

        {isReady ? (
          hasNoCustomers ? (
            /* Zero Customers - Full Page Call to Action */
            <div className="flex-1 flex flex-col p-8 text-center">
              <div className="max-w-xs mx-auto space-y-8 mt-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Help us fill up America! 🇺🇸
                  </h2>
                  <p className="text-lg text-gray-700">
                    Be our first customer in <span className="font-semibold text-blue-600">{stateInfo.name}</span> and get <span className="font-bold text-green-600">50% off</span> your first 6 months.
                  </p>
                </div>
                
                {accountExecutive && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      {accountExecutive.image && accountExecutive.image.trim() !== '' && (
                        <ImageWithFallback
                          src={`/data/images/${accountExecutive.image}`}
                          alt={accountExecutive.name}
                          width={80}
                          height={80}
                          className="rounded-full border-4 border-blue-200"
                        />
                      )}
                    </div>
                    
                    <div
                      onClick={() => handleScheduleClick(accountExecutive.demo_link)}
                      className="group block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="text-xl font-bold">
                          Talk to {accountExecutive.name.split(' ')[0]} today
                        </div>
                        <div className="text-blue-100">
                          Book your demo and claim your 50% discount
                        </div>
                        <div className="flex items-center justify-center mt-3">
                          <ArrowUpRight className="w-6 h-6 text-white/80 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Normal State with Customers */
            <>
              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6 pb-32">
                  {/* Upcoming Events Section */}
                  {eventsForState.length > 0 && (
                    <div className="space-y-4">
                      {eventsForState.map((event) => (
                        <EventCard key={event.name} event={event} />
                      ))}
                    </div>
                  )}

                  {/* Customer Stories Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Customer Stories
                      </h3>
                      {customerStories.length > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a href="https://tally.so/r/wvlv8X" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <Megaphone className="w-5 h-5" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Already use Kibu? Request a story!</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    
                    {customerStories.length === 0 ? (
                      <a 
                        href="https://tally.so/r/wvlv8X"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block text-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 relative"
                      >
                        <h4 className="font-bold text-gray-800">Already use Kibu?</h4>
                        <p className="text-sm text-gray-600 mt-1">Be our first story from {stateInfo.name} and get 2 months free, plus a social media shoutout!</p>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 absolute top-3 right-3 group-hover:text-blue-500 transition-colors" />
                      </a>
                    ) : (
                      <div className="space-y-4">
                        {customerStories.map((story) => (
                          <a
                            key={story.url}
                            href={story.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 bg-white/70 border border-black/6 rounded-xl p-4 transition-all duration-200 hover:bg-white/90 hover:border-blue-200 hover:-translate-y-0.5 hover:shadow-lg"
                          >
                            <div className="flex-shrink-0">
                              <ImageWithFallback
                                key={story.imageUrl || 'no-image'}
                                src={story.imageUrl}
                                alt={story.title}
                                width={60}
                                height={60}
                                className="rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                {story.title}
                              </h4>
                              <span className="text-sm text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                                Read More
                                <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Love Section */}
                  {loveForState.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Love from {stateInfo.name}
                      </h3>
                      <div className="space-y-4">
                        {loveForState.map((love) => (
                          <div key={love.name} className="bg-white/70 border border-black/6 rounded-xl p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                {love.image ? (
                                  <ImageWithFallback
                                    src={`/data/images/${love.image}`}
                                    alt={love.organization}
                                    width={32}
                                    height={32}
                                    className="rounded"
                                  />
                                ) : (
                                  <OrgLogoPlaceholder
                                    name={love.organization}
                                    width={32}
                                    height={32}
                                    className="rounded"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-sm">{love.name}</div>
                                <div className="text-xs text-gray-600">{love.title}</div>
                                <div className="text-xs text-gray-500">{love.organization}</div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 italic">{love.quote}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* State Resources Section */}
                  {stateResources.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {stateInfo.name} Resources
                      </h3>
                      
                      <div className="space-y-4">
                        {stateResources.map((resource) => (
                          <a
                            key={resource.url}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 bg-white/70 border border-black/6 rounded-xl p-4 transition-all duration-200 hover:bg-white/90 hover:border-blue-200 hover:-translate-y-0.5 hover:shadow-lg"
                          >
                            <div className="flex-shrink-0">
                              <ImageWithFallback
                                key={resource.imageUrl || 'no-image'}
                                src={resource.imageUrl}
                                alt={resource.title}
                                width={60}
                                height={60}
                                className="rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                {resource.title}
                              </h4>
                              <span className="text-sm text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                                Read More
                                <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky Call-to-Action at Bottom */}
              {accountExecutive && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
                  <div
                    onClick={() => handleScheduleClick(accountExecutive.demo_link)}
                    className="group flex items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      {accountExecutive.image && accountExecutive.image.trim() !== '' && (
                        <ImageWithFallback
                          src={`/data/images/${accountExecutive.image}`}
                          alt={accountExecutive.name}
                          width={48}
                          height={48}
                          className="rounded-full border-2 border-white/20"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white mb-1">
                        Talk to {accountExecutive.name.split(' ')[0]} today
                      </div>
                      <div className="text-sm text-blue-100">
                        Book a personalized demo
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              )}
            </>
          )
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
