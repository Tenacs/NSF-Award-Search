'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Root, Trigger, Portal, Overlay, Content, Title, Description, Close} from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useSearchParams } from 'next/navigation'
import Sidebar from './Sidebar'
import { useRouter} from 'next/navigation'



interface Award {
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
  primary_investigators?: string
  co_primary_investigators?: string
  programElementCodes?: string
  programReferenceCodes?: string
}

function Results() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Award[]>([])
  const [sortBy, setSortBy] = useState('relevance')
  const [isPlotlyScriptLoaded, setIsPlotlyScriptLoaded] = useState(false);
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [activeChartTab, setActiveChartTab] = useState('Chart1')
  const [plotlyData, setPlotlyData] = useState<{ [key: string]: any }>({})
  const [message, setMessage] = useState('')
  

  // Load Plotly script and fetch results if search query is present
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
    script.onload = () => setIsPlotlyScriptLoaded(true);
    document.body.appendChild(script);

    // fetch results based on search query
    if (searchParams.get('searchType') == 'title'){
      setSearchQuery(searchParams.get('title') ?? '')
      fetchAwards(`/api/search_award_title?title=${searchParams.get('title') ?? ''}`);
    }
    else if (searchParams.get('searchType') == 'name'){
      setSearchQuery(searchParams.get('name') ?? '')
      fetchAwards(`/api/search_name?name=${searchParams.get('name') ?? ''}&includeCoPI=${searchParams.get('includeCoPI') ?? ''}`);
    }
    else if (searchParams.get('searchType') == 'program'){
      setSearchQuery(searchParams.get('program') ?? searchParams.get('programOfficer') ?? searchParams.get('elementCode') ?? searchParams.get('referenceCode') ?? '')
      // TO-DO
      //fetchAwards(`/api/search_program?program=${searchParams.get('program') ?? ''});
    }
    else if (searchParams.get('searchType') == 'organization'){
      setSearchQuery(searchParams.get('organization') ?? '')
      fetchAwards(`/api/search_institution?institution=${searchParams.get('organization') ?? ''}`);
    }
    else if (searchParams.get('keyword') != null){
      setSearchQuery(searchParams.get('keyword') ?? '')
      fetchAwards(`/api/search_keyword?keyword=${searchParams.get('keyword') ?? ''}`);
    }
    else{
      setMessage("Please enter a search query")
    }

  }, []);


  // Fetch plot data whenever results change
  useEffect(() => {
    if (results.length === 0) return;
    getPlotlyChart('bar', results, "Chart1");
    getPlotlyChart('line', results, "Chart2");
    getPlotlyChart('bar', results, "Chart3");
    getPlotlyChart('', results, "Chart4");
  }, [results]);


  function getPlotlyChart(type: string, data: Award[], tabs: string) {
    
    fetch('/api/example', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"type": type, "results": data}),
    })
    .then((res) => res.json())
    .then((data) => setPlotlyData((prev) => ({ ...prev, [tabs]: data })))
    .catch((err) => console.error('Error loading Plotly data:', err));
  }


  useEffect(() => {
    if (isPlotlyScriptLoaded && modalIsOpen && plotlyData[activeChartTab] != null) {
      setIsGraphLoading(true);
      // @ts-ignore
      setTimeout(() => {
        // @ts-ignore
        Plotly.newPlot(`plotDiv${activeChartTab.slice(-1)}`, plotlyData[activeChartTab], {}).then((a) => {console.log(a); setIsGraphLoading(false)});
      }, 0);
        
    }
  }, [isPlotlyScriptLoaded, modalIsOpen, activeChartTab, plotlyData]);


  // Function to handle search button click - search by keyword
  const handleSearch = () => {
    setResults([])
    if (searchQuery.trim() === '') {
      setMessage('Please enter award title')
      return
    }
    router.push(`/results?keyword=${searchQuery.trim()}`);
    
    fetchAwards(`/api/search_keyword?keyword=${searchQuery.trim()}`);
  }


  // Function to fetch awards from input link
  function fetchAwards (link: string){
    setMessage("Loading...")

    fetch(link)
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
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">

        {/* Search bar */}
        <form onSubmit={(e) => {e.preventDefault(); handleSearch()}} className="mb-4">
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search awards"
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
            {message !== 'Loading...' && <span className="text-sm">Found {results.length} {results.length == 1 ? 'award' : 'awards'}.</span>}
            {results.length > 0 && <>
            <span className="text-sm">Export:</span>
            <Button variant="outline" size="sm" onClick={() => {}}>CSV</Button>
            <Button variant="outline" size="sm" onClick={() => {}}>XML</Button> </>}
          </div>
          <div className="flex items-center space-x-2">

            {/*Pop up dialog for data visualization*/}
            {results.length > 0 && 
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
                      <div id="plotDiv1" style={{"height": "500px", "width": "800px"}}>{isGraphLoading && <span>Loading...</span>}</div>
                    </TabsContent>
                    <TabsContent value="Chart2" className="flex justify-center">
                      <div id="plotDiv2" style={{"height": "500px", "width": "800px"}} >{isGraphLoading && <span>Loading...</span>}</div>
                    </TabsContent>
                    <TabsContent value="Chart3" className="flex justify-center">
                      <div id="plotDiv3" style={{"height": "500px", "width": "800px"}} >{isGraphLoading && <span>Loading...</span>}</div>
                    </TabsContent>
                    <TabsContent value="Chart4" className="flex justify-center">
                      <div id="plotDiv4" style={{"height": "500px", "width": "800px"}} >{isGraphLoading && <span>Loading...</span>}</div>
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
          }
            
              {/* Sort By dropdown */}
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

          {message && <div className="p-4 mt-5 text-center">{message}</div>}

          {message.length == 0 && results.map((result, index) => (
            <div key={index} className={`p-4 ${index !== results.length - 1 ? 'border-b' : ''}`}>
              <a href={`https://www.nsf.gov/awardsearch/showAward?AWD_ID=${result.awardID}`} target="_blank" className="text-blue-600 hover:underline text-lg">
                {result.title}
              </a>
              {/* {<h3 className="text-blue-600 hover:underline text-lg mb-2">{result.title}</h3>} */}
              <p className="text-sm text-gray-600">
                Award Number: {result.awardID}; Principal Investigator: {result.primary_investigators}; 
                Co-Principal Investigator: {result.co_primary_investigators};
                Organization: {result.institution};
                NSF Organization: {result.org_abbr}; Start Date: {result.effectiveDate}; 
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

export default function SearchResults(){
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Results />
    </Suspense>
  )
}