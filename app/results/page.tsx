'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search, ChevronLeft, ChevronRight} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Root, Trigger, Portal, Overlay, Content, Title, Description, Close} from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useSearchParams } from 'next/navigation'
import Sidebar from './Sidebar'
import { useRouter} from 'next/navigation'



export interface Award {
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
  const [filteredResults, setFilteredResults] = useState<Award[]>([]);
  const [sortBy, setSortBy] = useState('relevance')
  const [isPlotlyScriptLoaded, setIsPlotlyScriptLoaded] = useState(false);
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [activeChartTab, setActiveChartTab] = useState('Chart1')
  const [plotlyData, setPlotlyData] = useState<{ [key: string]: any }>({})
  const [message, setMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 50

  // Load Plotly script and fetch results if search query is present
  useEffect(() => {
    // Check if the Plotly script is already added
    if (!document.querySelector('script[src="https://cdn.plot.ly/plotly-latest.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
      script.onload = () => setIsPlotlyScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsPlotlyScriptLoaded(true);
  }
    const advancedQuery = getAdvancedSearch(searchParams);

    // fetch results based on search query
    if (searchParams.get('searchType') == 'title'){
      const title = searchParams.get('title') ?? ''
      setSearchQuery(title)
      fetchAwards(`/api/search_award_title?title=${title + advancedQuery}`, title);
    }
    else if (searchParams.get('searchType') == 'name'){
      const name = searchParams.get('name') ?? ''
      setSearchQuery(name)
      fetchAwards(`/api/search_name?name=${name}&includeCoPI=${searchParams.get('includeCoPI') ?? ''}${advancedQuery}`, name);
    }
    else if (searchParams.get('searchType') == 'program'){
      const program = searchParams.get('program')  ?? ''
      const programOfficer = searchParams.get('programOfficer')  ?? ''
      const elemCode = searchParams.get('elementCode')  ?? ''
      const refCode = searchParams.get('referenceCode')  ?? ''
      setSearchQuery(program ?? programOfficer ?? elemCode ?? refCode ?? '')

      fetchAwards(`/api/search_program?program=${program}&programOfficer=${programOfficer}&elementCode=${elemCode}&referenceCode=${refCode + advancedQuery}`, program);
    }
    else if (searchParams.get('searchType') == 'organization'){
      const org = searchParams.get('organization') ?? ''
      setSearchQuery(org)
      fetchAwards(`/api/search_institution?institution=${org  + advancedQuery}`, org);
    }
    else if (searchParams.get('keyword')){
      const keyword = searchParams.get('keyword') ?? ''
      setSearchQuery(keyword)
      fetchAwards(`/api/search_keyword?keyword=${keyword  + advancedQuery}`, keyword);
    }
    else{
      setMessage("Please enter a search query")
    }

  }, []);

  function getAdvancedSearch(params: URLSearchParams){
    var query = ''
    if (params.get('state')){
      query += `&state=${params.get('state')}`
    }
    if (params.get('country')){
      query += `&country=${params.get('country')}`
    }
    if (params.get('zipCode')){
      query += `&zipCode=${params.get('zipCode')}`
    }
    if (params.get('startYear')){
      query += `&startYear=${params.get('startYear')}`
    }
    if (params.get('endYear')){
      query += `&endYear=${params.get('endYear')}`
    }
    return query
  }

  // Fetch plot data whenever results change
  useEffect(() => {
    if (results.length === 0 || filteredResults.length === 0) return;
    setCurrentPage(1)
    getPlotlyCharts(filteredResults);
  }, [results, filteredResults]);


  function getPlotlyCharts(data: Award[]) {
    
    fetch('/api/example', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then((res) => res.json())
    .then((data) => setPlotlyData({"Chart1": JSON.parse(data['fig1']), "Chart2": JSON.parse(data['fig2']), "Chart3": JSON.parse(data['fig3']), "Chart4": JSON.parse(data['fig4']), 
      "Chart5": JSON.parse(data['fig5'])
    }))
    .catch((err) => console.error('Error loading Plotly data:', err));
  }


  useEffect(() => {
    if (isPlotlyScriptLoaded && modalIsOpen && plotlyData[activeChartTab] != null) {
      setIsGraphLoading(true);
      // @ts-ignore
      setTimeout(() => {
        var plot = plotlyData[activeChartTab];
        plot.layout = {...plot.layout, modebar: {orientation: 'v'}, width: 900, height: 500, margin: {r: 120}};
        // @ts-ignore
        Plotly.newPlot(`plotDiv${activeChartTab.slice(-1)}`, plot, {}).then(setIsGraphLoading(false));
      }, 0);
        
    }
  }, [isPlotlyScriptLoaded, modalIsOpen, activeChartTab, plotlyData]);


  // Function to handle search button click - search by keyword
  const handleSearch = () => {
    setResults([])
    setFilteredResults([]);
    setCurrentPage(1)
    const keyword = searchQuery.trim()
    if (keyword === '') {
      setMessage('Please enter award title')
      return
    }
    router.push(`/results?keyword=${keyword}`);
    
    fetchAwards(`/api/search_keyword?keyword=${keyword}`, keyword);
  }


  // Function to fetch awards from input link
  function fetchAwards (link: string, query: string){
    setMessage("Loading...")

    fetch(link)
    .then((res) => res.json())
    .then((data) => {
      data.length === 0 ? setMessage('Your search did not return any results.') : setMessage('')
      const highlightedData = data.map((award: Award) => ({
        ...award,
        awardID: highlightMatch(award.awardID, query),
        primary_investigators: highlightMatch(award.primary_investigators, query),
        co_primary_investigators: highlightMatch(award.co_primary_investigators, query),
        institution: highlightMatch(award.institution, query),
      }));

      setResults(sortResults(highlightedData, sortBy))
      setFilteredResults(sortResults(highlightedData, sortBy))
    })
    .catch((error) => {
      setMessage('An error occurred while fetching data. Please check console for more details.')
      console.error('Error:', error)
    })

    console.log('Searching for:', query)
  }
  
    // Exporting to JSON
    const exportToJSON = () => {
      const jsonString = JSON.stringify(filteredResults, null, 2); // 2 spaces for pretty formatting
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "awards.json";
      link.click();
      URL.revokeObjectURL(url);
    };

    // Exporting to CSV
    const exportToCSV = () => {
      const header = Object.keys(filteredResults[0]).join(",");
      const rows = filteredResults.map(obj => Object.values(obj).join(",")).join("\n");
      const csvString = header + "\n" + rows;
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "awards.csv";
      link.click();
      URL.revokeObjectURL(url);
  };

  // Function to sort results
  const sortResults = (data: Award[], sortBy: string) => {
    return [...data].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.effectiveDate || '').getTime() - new Date(a.effectiveDate || '').getTime();
      } else if (sortBy === 'amount') {
        return (b.amount || 0) - (a.amount || 0);
      } else {
        // Default to relevance
        const query = searchQuery.toLowerCase();
        const wholeWordRegex = new RegExp(`\\b${query}\\b`, 'i');
        
        const aWholeWordMatch = wholeWordRegex.test(a.title || '');
        const bWholeWordMatch = wholeWordRegex.test(b.title || '');

        if (aWholeWordMatch && !bWholeWordMatch) return -1; // a should come first
        if (!aWholeWordMatch && bWholeWordMatch) return 1;  // b should come first

        const aPartialMatch = (a.title || '').toLowerCase().includes(query);
        const bPartialMatch = (b.title || '').toLowerCase().includes(query);

        if (aPartialMatch && !bPartialMatch) return -1; // a should come first
        if (!aPartialMatch && bPartialMatch) return 1;  // b should come first

        return 0;
      }
    });
  };

  // Re-sort results whenever sortBy changes
  useEffect(() => {
    setResults(prevResults => sortResults(prevResults, sortBy));
    setFilteredResults(prevResults => sortResults(prevResults, sortBy));
  }, [sortBy]);


  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col">
        <Sidebar results={results} setFilteredResults={setFilteredResults}/>
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
            {message !== 'Loading...' && <span className="text-sm">Found {filteredResults.length} {filteredResults.length == 1 ? 'award' : 'awards'}.</span>}
            {filteredResults.length > 0 && <>
            <span className="text-sm">Export:</span>
            <Button variant="outline" size="sm" onClick={() => {exportToCSV()}}>CSV</Button>
            <Button variant="outline" size="sm" onClick={() => {exportToJSON()}}>JSON</Button> </>}
          </div>
          <div className="flex items-center space-x-2">

            {/*Pop up dialog for data visualization*/}
            {filteredResults.length > 0 && 
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

                  <Tabs value={activeChartTab} onValueChange={setActiveChartTab} style={{"height": "600px", "width": "950px"}}>
                    <TabsList className="grid w-full grid-cols-5 mt-1">
                      <TabsTrigger value="Chart1">Departments</TabsTrigger>
                      <TabsTrigger value="Chart2">By Year</TabsTrigger>
                      <TabsTrigger value="Chart3">US States</TabsTrigger>
                      <TabsTrigger value="Chart4">Top 5 Awards</TabsTrigger>
                      <TabsTrigger value="Chart5">By Year Line</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Chart1" className="flex justify-center">
                      <div id="plotDiv1" style={{"height": "500px", "width": "900px"}}>{isGraphLoading && <span>Loading...</span>}</div>
                    </TabsContent>
                    <TabsContent value="Chart2" className="flex justify-center">
                      <div id="plotDiv2" style={{"height": "500px", "width": "900px"}} >{isGraphLoading && <span>Loading...</span>}</div>
                    </TabsContent>
                    <TabsContent value="Chart3" className="flex justify-center">
                      <div id="plotDiv3" style={{"height": "500px", "width": "900px"}} >{isGraphLoading && <span>Loading...</span>}</div>
                    </TabsContent>
                    <TabsContent value="Chart4" className="flex justify-center">
                      <div id="plotDiv4" style={{"height": "500px", "width": "900px"}} >{isGraphLoading && <span>Loading...</span>}</div>
                    </TabsContent>
                    <TabsContent value="Chart5" className="flex justify-center">
                      <div id="plotDiv5" style={{"height": "500px", "width": "900px"}}>{isGraphLoading && <span>Loading...</span>}</div>
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

          {message.length == 0 && filteredResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage).map((result, index) => (
            <div key={index} className={`p-4 ${index !== filteredResults.length - 1 ? 'border-b' : ''}`}>
                <a href={`https://www.nsf.gov/awardsearch/showAward?AWD_ID=${result.awardID?.replace(/<\/?b>/g, '')}`} target="_blank" className="text-blue-600 hover:underline text-lg">
                {result.title}
              </a>
              <p className="text-sm text-gray-600">
                Award Number: <span dangerouslySetInnerHTML={{ __html: result.awardID ?? '' }} />; 
                Principal Investigator: <span dangerouslySetInnerHTML={{ __html: result.primary_investigators ?? '' }} />; 
                Co-Principal Investigator: <span dangerouslySetInnerHTML={{ __html: result.co_primary_investigators ?? '' }} />;
                Organization: <span dangerouslySetInnerHTML={{ __html: result.institution ?? '' }} />;
                NSF Organization: {result.org_abbr ?? result.org_name}; Start Date: {result.effectiveDate}; 
                Award Amount: ${result.amount?.toLocaleString()};
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Displaying {filteredResults.length == 0 ? 0 : (currentPage - 1) * resultsPerPage + 1} - {Math.min(currentPage * resultsPerPage, filteredResults.length)} of {filteredResults.length}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Page {currentPage} of {Math.ceil(filteredResults.length / resultsPerPage) || 1}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredResults.length / resultsPerPage), prev + 1) || 1)}
              disabled={currentPage === Math.ceil(filteredResults.length / resultsPerPage) || filteredResults.length === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}


function highlightMatch(text?: string, query?: string){
  if (!query || !text) return text;

  // Escape special regex characters in the query string
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return text.replace(regex, '<b>$1</b>');
}
export default function SearchResults(){
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Results />
    </Suspense>
  )
}