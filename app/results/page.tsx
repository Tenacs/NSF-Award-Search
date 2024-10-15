'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronRight, Home} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'

interface Result {
  awardID?: string;
  title?: string;
  awardNumber?: string;
  effectiveDate?: string;
  expDate?: string;
  amount?: number;
  instrument?: string;
  programOfficer?: string;
  institution?: string;
  zipCode?: string;
  state?: string;
  country?: string;
  org_abbr?: string;
  org_name?: string;
}

export default function SearchResults() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [sortBy, setSortBy] = useState('relevance')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isPlotlyLoaded, setIsPlotlyLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false)


  // import Plotly script for visualization
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
    script.onload = () => {
      setIsPlotlyLoaded(true);
    };
    document.body.appendChild(script);
  }, []);


  // Plot results using Plotly - need to create a div with id='plotDiv' to display the plot
  useEffect(() => {
    if (isPlotlyLoaded) {

      if (results.length > 0) {
      // @ts-ignore
      //Plotly.plot('plotDiv',results,{});
      }
      
    }
  }, [isPlotlyLoaded]);


  // Function to handle search button click
  const handleSearch = () => {

    if (searchQuery.trim() === '') {
      alert('Please enter award title')
      return
    }

    setIsLoading(true);
    fetch(`/api/search_award_title?title=${searchQuery}`)
    .then((res) => res.json())
    .then((awardData) => {
      setIsLoading(false)
      setResults(awardData)
    })

    console.log('Searching for:', searchQuery)
  }

  
  const handleExport = (format: string) => {
    // Implement export logic here
    console.log('Exporting in format:', format)
  }


  return (
    <div className="flex h-screen bg-gray-100">
      
      <div className="flex flex-col">
        
        {/* Home Button */}
        <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/') }
            className="w-full flex items-center justify-start ml-2 p-4 hover:bg-white mt-5"
          >
          <Home className="h-6 w-6 mr-2" />
          {isSidebarOpen && <span><b>Main Search Page</b></span>}
        </Button>

        {/* Sidebar for filtering data */}
        <div style={{marginTop: '68px', marginBottom: '63px', height: '100%'}}
          className={`bg-white border h-100 rounded-lg bg-white transition-all duration-300 ease-in-out 
            overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-12'}`}>

          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4">
              {isSidebarOpen && <h2 className="text-lg font-semibold">Refined by</h2>}
              <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isSidebarOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {/* <div>
                    <h3 className="font-medium mb-2">State</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox id="state-az" />
                        <label htmlFor="state-az" className="ml-2 text-sm">Arizona (1)</label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="state-ca" />
                        <label htmlFor="state-ca" className="ml-2 text-sm">California (1)</label>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      
      
      {/* Main content */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">

        {/* Search bar */}
        <form onSubmit={(e) => {e.preventDefault(); handleSearch()}} className="mb-4">
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search award titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-white"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </form>

        {/* Export and sort controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Export up to 3,000 Awards:</span>
            <Button variant="outline" size="sm" onClick={() => {}}>CSV</Button>
            <Button variant="outline" size="sm" onClick={() => {}}>XML</Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Sort By:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto border rounded-lg bg-white">
          {isLoading && <div className="p-4 text-center">Loading...</div>}
          {results.map((result, index) => (
            <div key={index} className={`p-4 ${index !== results.length - 1 ? 'border-b' : ''}`}>
              <a href={`https://www.nsf.gov/awardsearch/showAward?AWD_ID=${result.awardID}`} target="_blank" className="text-blue-600 hover:underline text-lg">
                {result.title}
              </a>
              {/* {<h3 className="text-blue-600 hover:underline text-lg mb-2">{result.title}</h3>} */}
              <p className="text-sm text-gray-600">
                Award Number: {result.awardID}; Program Officer: {result.programOfficer}; 
                Organization: {result.institution}; Start Date: {result.effectiveDate}; 
                Award Amount: ${result.amount?.toLocaleString()};
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Displaying {results.length == 0 ? 0 : 1} - {results.length} of {results.length}
          </div>
        </div>
      </div>
    </div>
  )
}