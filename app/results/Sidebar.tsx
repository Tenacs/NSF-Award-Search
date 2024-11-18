// Sidebar.tsx
import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award } from './page';

interface SidebarProps {
  results: Award[];
  setFilteredResults: React.Dispatch<React.SetStateAction<Award[]>>;
}

export default function Sidebar({ results, setFilteredResults }: SidebarProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categories, setCategories] = useState<{
    [key: string]: { [key: string]: number };
  }>({});
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  // Update filteredResults when selectedFilters change
  useEffect(() => {
    if (Object.keys(selectedFilters).length === 0) {
      setFilteredResults(results);
    } else {
      const filtered = results.filter((result) =>
        Object.entries(selectedFilters).every(
          ([category, value]) => result[category as keyof Award] === value
        )
      );
      setFilteredResults(filtered);
    }
  }, [selectedFilters, results, setFilteredResults]);

  // Recalculate categories based on the filtered results
  useEffect(() => {
    const currentResults =
      Object.keys(selectedFilters).length === 0
        ? results
        : results.filter((result) =>
            Object.entries(selectedFilters).every(
              ([category, value]) => result[category as keyof Award] === value
            )
          );

    const categoryCounts = currentResults.reduce((acc, result) => {
      ['institution', 'country', 'state', 'org_name'].forEach((category) => {
        const categoryValue = result[category as keyof Award];
        if (categoryValue) {
          acc[category] = acc[category] || {};
          acc[category][categoryValue] = (acc[category][categoryValue] || 0) + 1;
        }
      });
      return acc;
    }, {} as { [key: string]: { [key: string]: number } });

    setCategories(categoryCounts);
  }, [results, selectedFilters]);

  const handleFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleClearFilter = (category: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[category];
      return newFilters;
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <>
      {/* Home Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/')}
        className="w-full flex items-center justify-start ml-2 p-4 hover:bg-white mt-5"
      >
        <Home className="h-6 w-6 mr-2" />
        {isSidebarOpen && (
          <span>
            <b>Main Search Page</b>
          </span>
        )}
      </Button>

      {/* Sidebar for filtering data */}
      <div
        style={{ marginTop: '68px', marginBottom: '63px', height: '100%' }}
        className={`bg-white border h-100 rounded-lg transition-all duration-300 ease-in-out 
        overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-12'}`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4">
            {isSidebarOpen && (
              <h2 className="text-lg font-semibold">Refine:</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 ${
                  isSidebarOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </div>
          {isSidebarOpen && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {Object.keys(categories).map((category) => {
                  const values = Object.keys(categories[category]);
                  const isExpanded = expandedCategories[category];
                  const displayedValues = isExpanded ? values : values.slice(0, 10);

                  return (
                    <div key={category}>
                      <h3 className="font-medium mb-2 capitalize">{category}</h3>
                      <div className="space-y-2">
                        {selectedFilters[category] ? (
                          <div className="flex items-center">
                            <span className="mr-2 font-small font-semibold">
                              {selectedFilters[category]}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClearFilter(category)}
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <>
                            {displayedValues.map((value) => (
                              <div key={value} className="flex items-center">
                                <Button
                                  className="text-blue-600 text-wrap"
                                  variant="link"
                                  size="sm"
                                  onClick={() => handleFilter(category, value)}
                                >
                                  {value.replace(/<\/?b>/g, '')} ({categories[category][value]})
                                </Button>
                              </div>
                            ))}

                            {/* Show more/less button */}
                            {values.length > 10 && (
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => toggleCategory(category)}
                              >
                                {isExpanded ? "Show less" : "Show more"}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}