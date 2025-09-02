'use client';

import { StateInfo, ContentItem, TeamMember } from '@/lib/types';
import { getCustomerStoriesForState, getStateResourcesForState, getAccountExecutiveForState } from '@/lib/map-utils';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import AvatarPlaceholder from '@/components/ui/avatar-placeholder';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StateInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stateInfo: StateInfo | null;
  contentData: ContentItem[];
}

export default function StateInfoPanel({ isOpen, onClose, stateInfo, contentData }: StateInfoPanelProps) {
  const [teamData, setTeamData] = useState<TeamMember[]>([]);

  useEffect(() => {
    // Load team data
    fetch('/data/team.json')
      .then(response => response.json())
      .then(data => setTeamData(data))
      .catch(error => console.error('Error loading team data:', error));
  }, []);

  if (!stateInfo) return null;

  const customerStories = getCustomerStoriesForState(stateInfo.name, contentData);
  const stateResources = getStateResourcesForState(stateInfo.name, contentData);
  const accountExecutive = getAccountExecutiveForState(stateInfo.name, teamData);

  // Check if this state has zero customers
  const hasNoCustomers = stateInfo.count === 0;

  return (
    <Sheet open={isOpen} onOpenChange={() => {}} modal={false}>
      <SheetContent className="w-[400px] sm:w-[400px] md:w-[400px] lg:w-[400px] h-full bg-white border-l border-gray-200 shadow-2xl data-[state=open]:slide-in-from-right-0 data-[state=closed]:slide-out-to-right-0 [&>button]:hidden flex flex-col">
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

        {hasNoCustomers ? (
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
                    {accountExecutive.image && accountExecutive.image.trim() !== '' ? (
                      <ImageWithFallback
                        src={`/data/images/${accountExecutive.image}`}
                        alt={accountExecutive.name}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-blue-200"
                      />
                    ) : (
                      <AvatarPlaceholder
                        name={accountExecutive.name}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-blue-200"
                      />
                    )}
                  </div>
                  
                  <a
                    href={accountExecutive.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-1 hover:shadow-xl"
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
                  </a>
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
                {/* Customer Stories Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Customer Stories
                  </h3>
                  
                  {customerStories.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 italic">
                      No stories yet!
                    </div>
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
                <a
                  href={accountExecutive.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex-shrink-0">
                    {accountExecutive.image && accountExecutive.image.trim() !== '' ? (
                      <ImageWithFallback
                        src={`/data/images/${accountExecutive.image}`}
                        alt={accountExecutive.name}
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-white/20"
                      />
                    ) : (
                      <AvatarPlaceholder
                        name={accountExecutive.name}
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
                </a>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
