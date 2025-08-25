'use client';

import { StateInfo, CustomerData, CustomerStory } from '@/lib/types';
import { getCustomerStoriesForState } from '@/lib/map-utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface StateInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stateInfo: StateInfo | null;
  customerData: CustomerData[];
}

export default function StateInfoPanel({ isOpen, onClose, stateInfo, customerData }: StateInfoPanelProps) {
  if (!stateInfo) return null;

  const customerStories = getCustomerStoriesForState(stateInfo.name, customerData);

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
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Stories
            </h3>
            
            {customerStories.length === 0 ? (
              <div className="text-center py-6 text-gray-500 italic">
                No customer stories available for this state yet.
              </div>
            ) : (
              <div className="space-y-4">
                {customerStories.map((story, index) => (
                  <a
                    key={index}
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/70 border border-black/6 rounded-xl p-4 transition-all duration-200 hover:bg-white/90 hover:border-blue-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {story.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {story.description}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
