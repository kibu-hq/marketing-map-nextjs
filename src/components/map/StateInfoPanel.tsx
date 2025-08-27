'use client';

import { StateInfo, ContentItem } from '@/lib/types';
import { getCustomerStoriesForState, getStateResourcesForState } from '@/lib/map-utils';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, ArrowUpRight } from 'lucide-react';

interface StateInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stateInfo: StateInfo | null;
  contentData: ContentItem[];
}

export default function StateInfoPanel({ isOpen, onClose, stateInfo, contentData }: StateInfoPanelProps) {
  if (!stateInfo) return null;

  const customerStories = getCustomerStoriesForState(stateInfo.name, contentData);
  const stateResources = getStateResourcesForState(stateInfo.name, contentData);

  return (
    <Sheet open={isOpen} onOpenChange={() => {}} modal={false}>
      <SheetContent className="w-[400px] sm:w-[400px] md:w-[400px] lg:w-[400px] h-full overflow-y-auto bg-white border-l border-gray-200 shadow-2xl data-[state=open]:slide-in-from-right-0 data-[state=closed]:slide-out-to-right-0 [&>button]:hidden">
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
          <div className="flex flex-col mt-3">
            <span className="text-4xl font-bold text-blue-500 leading-none">
              {stateInfo.count}
            </span>
            <span className="text-sm text-gray-600 font-medium mt-1">
              Kibu customers
            </span>
          </div>
        </SheetHeader>

        <div className="p-4 space-y-6">
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
      </SheetContent>
    </Sheet>
  );
}
