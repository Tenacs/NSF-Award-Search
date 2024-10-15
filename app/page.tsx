'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('award')
  
  const [searchQuery, setSearchQuery] = useState({
    award: '',
    name: '',
    includeCoPI: true,
    program: '',
    programOfficer: '',
    elementCode: '',
    referenceCode: '',
    organization: '',
    state: '',
    zipCode: '',
    country: '',
    startYear: 2010,
    endYear: 2024
  })


  // function to validate startYear and endYear sliders
  useEffect(() => {
    if (searchQuery.startYear > searchQuery.endYear) {
      setSearchQuery((prev) => ({...prev, startYear: searchQuery.endYear}))
    }
  }, [searchQuery.startYear])

  useEffect(() => {
    if (searchQuery.endYear < searchQuery.startYear) {
      setSearchQuery((prev) => ({...prev, endYear: searchQuery.startYear}))
    }
  }, [searchQuery.endYear])



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/results")
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">NSF Awards Search</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="award">Award Title/ID</TabsTrigger>
            <TabsTrigger value="name">Name</TabsTrigger>
            <TabsTrigger value="program">Program</TabsTrigger>
            <TabsTrigger value="organization">Organization/University</TabsTrigger>
          </TabsList>
          <TabsContent value="award">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='pt-3'>
                <Input
                  id="award"
                  value={searchQuery.award}
                  onChange={(e) => setSearchQuery((prev) => ({...prev, award: e.target.value}))}
                  placeholder="Enter Award Title or Award ID"
                />
              </div>
              {renderAdvancedFilters()}
              {renderSearchButton()}
            </form>
          </TabsContent>
          <TabsContent value="name">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='pt-3'>
                <Input
                  id="name"
                  value={searchQuery.name}
                  onChange={(e) => setSearchQuery((prev) => ({...prev, name: e.target.value}))}
                  placeholder="Enter name"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeCoPI" 
                  checked={searchQuery.includeCoPI}
                  onCheckedChange={(checked) => setSearchQuery((prev) => ({...prev, includeCoPI: checked as boolean}))}
                />
                <Label htmlFor="includeCoPI">Include Co-Principal Investigator in name search</Label>
              </div>
              {renderAdvancedFilters()}
              {renderSearchButton()}
            </form>
          </TabsContent>
          <TabsContent value="program">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="program">Program</Label>
                <Select onValueChange={(value) => setSearchQuery((prev) => ({...prev, program: value}))} value={searchQuery.program}>
                  <SelectTrigger id="program">
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="ENG-Directorate For Engineering">ENG - Directorate For Engineering</SelectItem>
                  <SelectItem value="CSE-Direct For Computer & Info Scie & Enginr">CSE - Direct For Computer & Info Scie & Engineering</SelectItem>
                  <SelectItem value="MPS-Direct For Mathematical & Physical Scien">MPS - Direct For Mathematical & Physical Science</SelectItem>
                  <SelectItem value="EDU-Directorate for STEM Education">EDU - Directorate for STEM Education</SelectItem>
                  <SelectItem value="GEO-Directorate For Geosciences">GEO - Directorate For Geosciences</SelectItem>
                  <SelectItem value="SBE-Direct For Social, Behav & Economic Scie">SBE - Direct For Social, Behavioral & Economic Science</SelectItem>
                  <SelectItem value="O/D-Office Of The Director">O/D - Office Of The Director</SelectItem>
                  <SelectItem value="TIP-Dir for Tech, Innovation, & Partnerships">TIP - Dir for Tech, Innovation, & Partnerships</SelectItem>
                  <SelectItem value="BIO-Direct For Biological Sciences">BIO - Direct For Biological Sciences</SelectItem>
                  <SelectItem value="EHR-Direct For Education and Human Resources">EHR - Direct For Education and Human Resources</SelectItem>
                  <SelectItem value="BFA-Office of Budget, Finance, & Award Management">BFA - Office of Budget, Finance, & Award Management</SelectItem>
                  <SelectItem value="IRM-Office Of Information & Resource Mgmt">IRM - Office Of Information & Resource Mgmt</SelectItem>
                  <SelectItem value="OPP-Office Of Polar Programs">OPP - Office Of Polar Programs</SelectItem>
                  <SelectItem value="NCO-National Coordination Office">NCO - National Coordination Office</SelectItem>
                  <SelectItem value="NNCO-Natl Nanotechnology Coordinating Office">NNCO - Natl Nanotechnology Coordinating Office</SelectItem>
                  <SelectItem value="OCIO-Office of the Chief Information Officer">OCIO - Office of the Chief Information Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>



              <div>
                <Label htmlFor="programOfficer">Program Officer</Label>
                <Input
                  id="programOfficer"
                  value={searchQuery.programOfficer}
                  onChange={(e) => setSearchQuery((prev) => ({...prev, programOfficer: e.target.value}))}
                  placeholder="Enter Program Officer name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="elementCode">Element Code</Label>
                  <Input
                    id="elementCode"
                    value={searchQuery.elementCode}
                    onChange={(e) => setSearchQuery((prev) => ({...prev, elementCode: e.target.value}))}
                    placeholder="Enter Element Code"
                  />
                </div>
                <div>
                  <Label htmlFor="referenceCode">Reference Code</Label>
                  <Input
                    id="referenceCode"
                    value={searchQuery.referenceCode}
                    onChange={(e) => setSearchQuery((prev) => ({...prev, referenceCode: e.target.value}))}
                    placeholder="Enter Reference Code"
                  />
                </div>
              </div>
              
              {renderAdvancedFilters()}
              {renderSearchButton()}
            </form>
          </TabsContent>
          <TabsContent value="organization">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='pt-3'>
                <Input
                  id="organization"
                  value={searchQuery.organization}
                  onChange={(e) => setSearchQuery((prev) => ({...prev, organization: e.target.value}))}
                  placeholder="Enter organization name"
                />
              </div>
              {renderAdvancedFilters()}
              {renderSearchButton()}
            </form>
          </TabsContent>
        </Tabs>
      </div>
      <div id="plotDiv"></div>
    </main>
  )

  function renderAdvancedFilters() {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="filters">
          <AccordionTrigger>Advanced Filters</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Select onValueChange={(value) => setSearchQuery((prev) => ({...prev, state: value}))} value={searchQuery.state}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="Alabama">Alabama</SelectItem>
                  <SelectItem value="Alaska">Alaska</SelectItem>
                  <SelectItem value="American Samoa">American Samoa</SelectItem>
                  <SelectItem value="Arizona">Arizona</SelectItem>
                  <SelectItem value="Arkansas">Arkansas</SelectItem>
                  <SelectItem value="California">California</SelectItem>
                  <SelectItem value="Colorado">Colorado</SelectItem>
                  <SelectItem value="Connecticut">Connecticut</SelectItem>
                  <SelectItem value="Delaware">Delaware</SelectItem>
                  <SelectItem value="District of Columbia">District of Columbia</SelectItem>
                  <SelectItem value="Florida">Florida</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Hawaii">Hawaii</SelectItem>
                  <SelectItem value="Idaho">Idaho</SelectItem>
                  <SelectItem value="Illinois">Illinois</SelectItem>
                  <SelectItem value="Indiana">Indiana</SelectItem>
                  <SelectItem value="Iowa">Iowa</SelectItem>
                  <SelectItem value="Kansas">Kansas</SelectItem>
                  <SelectItem value="Kentucky">Kentucky</SelectItem>
                  <SelectItem value="Louisiana">Louisiana</SelectItem>
                  <SelectItem value="Maine">Maine</SelectItem>
                  <SelectItem value="Maryland">Maryland</SelectItem>
                  <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                  <SelectItem value="Michigan">Michigan</SelectItem>
                  <SelectItem value="Minnesota">Minnesota</SelectItem>
                  <SelectItem value="Mississippi">Mississippi</SelectItem>
                  <SelectItem value="Missouri">Missouri</SelectItem>
                  <SelectItem value="Montana">Montana</SelectItem>
                  <SelectItem value="Nebraska">Nebraska</SelectItem>
                  <SelectItem value="Nevada">Nevada</SelectItem>
                  <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                  <SelectItem value="New Jersey">New Jersey</SelectItem>
                  <SelectItem value="New Mexico">New Mexico</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="North Carolina">North Carolina</SelectItem>
                  <SelectItem value="North Dakota">North Dakota</SelectItem>
                  <SelectItem value="Ohio">Ohio</SelectItem>
                  <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                  <SelectItem value="Oregon">Oregon</SelectItem>
                  <SelectItem value="Palau">Palau</SelectItem>
                  <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                  <SelectItem value="Puerto Rico">Puerto Rico</SelectItem>
                  <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                  <SelectItem value="South Carolina">South Carolina</SelectItem>
                  <SelectItem value="South Dakota">South Dakota</SelectItem>
                  <SelectItem value="Tennessee">Tennessee</SelectItem>
                  <SelectItem value="Texas">Texas</SelectItem>
                  <SelectItem value="Utah">Utah</SelectItem>
                  <SelectItem value="Vermont">Vermont</SelectItem>
                  <SelectItem value="Virgin Islands">Virgin Islands</SelectItem>
                  <SelectItem value="Virginia">Virginia</SelectItem>
                  <SelectItem value="Washington">Washington</SelectItem>
                  <SelectItem value="West Virginia">West Virginia</SelectItem>
                  <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                  <SelectItem value="Wyoming">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={searchQuery.zipCode}
                  onChange={(e) => setSearchQuery((prev) => ({...prev, zipCode: e.target.value}))}
                  placeholder="Enter zip code"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select onValueChange={(value) => setSearchQuery((prev) => ({...prev, country: value}))} value={searchQuery.country}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                    <SelectItem value="CN">China</SelectItem>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="BR">Brazil</SelectItem>
                    <SelectItem value="VE">Venezuela</SelectItem>
                    <SelectItem value="BM">Bermuda</SelectItem>
                    <SelectItem value="PY">Paraguay</SelectItem>
                    <SelectItem value="CH">Switzerland</SelectItem>
                    <SelectItem value="ZA">South Africa</SelectItem>
                    <SelectItem value="UY">Uruguay</SelectItem>
                    <SelectItem value="SE">Sweden</SelectItem>
                    <SelectItem value="ID">Indonesia</SelectItem>
                    <SelectItem value="TR">Turkey</SelectItem>
                    <SelectItem value="ES">Spain</SelectItem>
                    <SelectItem value="FM">Micronesia</SelectItem>
                    <SelectItem value="AR">Argentina</SelectItem>
                    <SelectItem value="PL">Poland</SelectItem>
                    <SelectItem value="TW">Taiwan</SelectItem>
                    <SelectItem value="PR">Puerto Rico</SelectItem>
                    <SelectItem value="BG">Bulgaria</SelectItem>
                    <SelectItem value="PE">Peru</SelectItem>
                    <SelectItem value="CL">Chile</SelectItem>
                    <SelectItem value="TH">Thailand</SelectItem>
                    <SelectItem value="MA">Morocco</SelectItem>
                    <SelectItem value="MY">Malaysia</SelectItem>
                    <SelectItem value="HK">Hong Kong</SelectItem>
                    <SelectItem value="BE">Belgium</SelectItem>
                    <SelectItem value="CR">Costa Rica</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="NL">Netherlands</SelectItem>
                    <SelectItem value="CO">Colombia</SelectItem>
                    <SelectItem value="PK">Pakistan</SelectItem>
                    <SelectItem value="GL">Greenland</SelectItem>
                    <SelectItem value="VI">Virgin Islands, U.S.</SelectItem>
                    <SelectItem value="IE">Ireland</SelectItem>
                    <SelectItem value="PA">Panama</SelectItem>
                    <SelectItem value="NZ">New Zealand</SelectItem>
                    <SelectItem value="PF">French Polynesia</SelectItem>
                    <SelectItem value="AQ">Antarctica</SelectItem>
                    <SelectItem value="GR">Greece</SelectItem>
                    <SelectItem value="ZM">Zambia</SelectItem>
                    <SelectItem value="TZ">Tanzania</SelectItem>
                    <SelectItem value="AF">Afghanistan</SelectItem>
                    <SelectItem value="KE">Kenya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-full">
                <Label>Start Year</Label>
                <Slider
                  min={2010}
                  max={2024}
                  step={1}
                  value={[searchQuery.startYear]}
                  onValueChange={(value) => setSearchQuery((prev) => ({...prev, startYear: value[0]}))}
                  className="mt-2"
                />
                <div className="flex justify-between mt-1">
                  <span>{searchQuery.startYear}</span>
                </div>
              </div>
              <div className="col-span-full">
                <Label>End Year</Label>
                <Slider
                  min={2010}
                  max={2024}
                  step={1}
                  value={[searchQuery.endYear]}
                  onValueChange={(value) => setSearchQuery((prev) => ({...prev, endYear: value[0]}))}
                  className="mt-2"
                />
                <div className="flex justify-between mt-1">
                  <span>{searchQuery.endYear}</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  function renderSearchButton() {
    return (
      <div className="flex justify-end">
        <Button type="submit" className="flex-shrink-0">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
    )
  }
}

