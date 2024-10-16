'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronRight, Home} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Root, Trigger, Portal, Overlay, Content, Title, Description, Close} from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
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
  const [isPlotlyScriptLoaded, setIsPlotlyScriptLoaded] = useState(false);
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [activeChartTab, setActiveChartTab] = useState('Chart1')
  const [message, setMessage] = useState('')

  // import Plotly script for visualization
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
    script.onload = () => {
      setIsPlotlyScriptLoaded(true);
    };
    document.body.appendChild(script);
  }, []);


  // Plot results using Plotly
  useEffect(() => {
    if (isPlotlyScriptLoaded && modalIsOpen) {
      setIsGraphLoading(true);
      fetch('/api/example')
      .then((res) => res.json())
      .then((awardData) => {
        // @ts-ignore
        Plotly.newPlot(`plotDiv${activeChartTab.slice(-1)}`,awardData,{});
        setIsGraphLoading(false);
      })
      .catch((error) => {
        setIsGraphLoading(false);
        console.error('Error:', error);
      });
    }
  }, [isPlotlyScriptLoaded, modalIsOpen, activeChartTab]);


  // Function to handle search button click
  const handleSearch = () => {
    
    setMessage('')

    if (searchQuery.trim() === '') {
      setMessage('Please enter award title')
      return
    }

    setMessage("Loading...")
    fetch(`/api/search_award_title?title=${searchQuery}`)
    .then((res) => res.json())
    .then((awardData) => {
      awardData.length === 0 ? setMessage('Your search did not return any results.') : setMessage('')
      setResults(awardData)
    })
    .catch((error) => {
      setMessage('An error occurred while fetching data. Please check console for more details.')
      console.error('Error:', error)
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
            <span className="text-sm">Export Results:</span>
            <Button variant="outline" size="sm" onClick={() => {}}>CSV</Button>
            <Button variant="outline" size="sm" onClick={() => {}}>XML</Button>
          </div>
          <div className="flex items-center space-x-2">

            {/*Pop up dialog for data visualization*/}
            <Root open={modalIsOpen} onOpenChange={setModalIsOpen}>
              <Trigger asChild>
                <Button className="mr-4" variant="outline" size="default">Data Visualization</Button>
              </Trigger>
              <Portal>
                <Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">

                  <Title className="text-lg font-semibold">Results Breakdown</Title>
                  <Description className="mt-2 mb-4 text-sm text-gray-500">
                    Summary stats for your search results
                  </Description>

                  <Tabs value={activeChartTab} onValueChange={setActiveChartTab} style={{"height": "550px", "width": "900px"}}>
                    <TabsList className="grid w-full grid-cols-4 mt-1">
                      <TabsTrigger value="Chart1">Chart 1</TabsTrigger>
                      <TabsTrigger value="Chart2">Chart 2</TabsTrigger>
                      <TabsTrigger value="Chart3">Chart 3</TabsTrigger>
                      <TabsTrigger value="Chart4">Chart 4</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Chart1" className="flex justify-center">
                      <div id="plotDiv1" style={{"height": "500px", "width": "800px"}}>{isGraphLoading && <b>Loading...</b>}</div>
                    </TabsContent>
                    <TabsContent value="Chart2" className="flex justify-center">
                      <div id="plotDiv2" style={{"height": "500px", "width": "800px"}} >{isGraphLoading && <b>Loading...</b>}</div>
                    </TabsContent>
                    <TabsContent value="Chart3" className="flex justify-center">
                      <div id="plotDiv3" style={{"height": "500px", "width": "800px"}} >{isGraphLoading && <b>Loading...</b>}</div>
                    </TabsContent>
                    <TabsContent value="Chart4" className="flex justify-center">
                      <div id="plotDiv4" style={{"height": "500px", "width": "800px"}} >{isGraphLoading && <b>Loading...</b>}</div>
                    </TabsContent>
                  </Tabs>
                  
                  <Close asChild>
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-500">
                      <Cross2Icon />
                    </button>
                  </Close>
                </Content>
              </Portal>
            </Root>

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

          {message && <div className="p-4 text-center">{message}</div>}

          {message.length == 0 && results.map((result, index) => (
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