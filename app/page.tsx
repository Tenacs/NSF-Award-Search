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
import { useRouter} from 'next/navigation'

export default function SearchBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('title')
  const [searchQuery, setSearchQuery] = useState({
    title: '',
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
    startYear: 2000,
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

    let params = {}

    if (activeTab === 'title') {
      params ={
        title: searchQuery.title,
        searchType: 'title'
      }
    }
    else if (activeTab == 'name'){
      params ={
        name: searchQuery.name,
        includeCoPI: searchQuery.includeCoPI,
        searchType: 'name'
      }
    }
    else if (activeTab == 'program'){
      params ={
        program: searchQuery.program,
        programOfficer: searchQuery.programOfficer,
        elementCode: searchQuery.elementCode,
        referenceCode: searchQuery.referenceCode,
        searchType: 'program'
      }
    }
    else if (activeTab == 'organization'){
      params ={
        organization: searchQuery.organization,
        searchType: 'organization'
      }
    }

    if (searchQuery.state !== '') {
      params = {...params, state: searchQuery.state}
    }
    if (searchQuery.zipCode !== '') {
      params = {...params, zipCode: searchQuery.zipCode}
    }
    if (searchQuery.country !== '') {
      params = {...params, country: searchQuery.country}
    }
    if (searchQuery.startYear !== 2000 || searchQuery.endYear !== 2024) {
      params = {...params, startYear: searchQuery.startYear, endYear: searchQuery.endYear}
    }

    const query = Object.entries(params)
    .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    .reduce((acc, [key, value]) => {
      acc.append(key, value as string);
      return acc;
    }, new URLSearchParams())
    .toString();

    router.push(`/results?${query}`)
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">NSF Awards Search</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="title">Award Title/ID</TabsTrigger>
            <TabsTrigger value="name">Name</TabsTrigger>
            <TabsTrigger value="program">Program</TabsTrigger>
            <TabsTrigger value="organization">Organization/University</TabsTrigger>
          </TabsList>
          <TabsContent value="title">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='pt-3'>
                <Input
                  id="title"
                  value={searchQuery.title}
                  onChange={(e) => setSearchQuery((prev) => ({...prev, title: e.target.value}))}
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
                  <SelectItem value="Directorate For Engineering">ENG - Directorate For Engineering</SelectItem>
                  <SelectItem value="Direct For Computer & Info Scie & Enginr">CSE - Direct For Computer & Info Scie & Engineering</SelectItem>
                  <SelectItem value="Direct For Mathematical & Physical Scien">MPS - Direct For Mathematical & Physical Science</SelectItem>
                  <SelectItem value="Directorate for STEM Education">EDU - Directorate for STEM Education</SelectItem>
                  <SelectItem value="Directorate For Geosciences">GEO - Directorate For Geosciences</SelectItem>
                  <SelectItem value="For Social, Behav">SBE - Direct For Social, Behavioral & Economic Science</SelectItem>
                  <SelectItem value="Office Of The Director">O/D - Office Of The Director</SelectItem>
                  <SelectItem value="Dir for Tech, Innovation, & Partnerships">TIP - Dir for Tech, Innovation, & Partnerships</SelectItem>
                  <SelectItem value="Direct For Biological Sciences">BIO - Direct For Biological Sciences</SelectItem>
                  <SelectItem value="Direct For Education and Human Resources">EHR - Direct For Education and Human Resources</SelectItem>
                  <SelectItem value="Office of Budget, Finance, & Award Management">BFA - Office of Budget, Finance, & Award Management</SelectItem>
                  <SelectItem value="Office Of Information & Resource Mgmt">IRM - Office Of Information & Resource Mgmt</SelectItem>
                  <SelectItem value="Office Of Polar Programs">OPP - Office Of Polar Programs</SelectItem>
                  <SelectItem value="National Coordination Office">NCO - National Coordination Office</SelectItem>
                  <SelectItem value="Natl Nanotechnology Coordinating Office">NNCO - Natl Nanotechnology Coordinating Office</SelectItem>
                  <SelectItem value="Office of the Chief Information Officer">OCIO - Office of the Chief Information Officer</SelectItem>
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
    </main>
  )

  function renderAdvancedFilters() {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="filters">
          <AccordionTrigger>Advanced Filters</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
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
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Uruguay">Uruguay</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="New Zealand">New Zealand</SelectItem>
                    <SelectItem value="Bermuda">Bermuda</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="Denmark">Denmark</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                    <SelectItem value="Brazil">Brazil</SelectItem>
                    <SelectItem value="Sweden">Sweden</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Switzerland">Switzerland</SelectItem>
                    <SelectItem value="Austria">Austria</SelectItem>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="Colombia">Colombia</SelectItem>
                    <SelectItem value="Israel">Israel</SelectItem>
                    <SelectItem value="Finland">Finland</SelectItem>
                    <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                    <SelectItem value="Belgium">Belgium</SelectItem>
                    <SelectItem value="Estonia">Estonia</SelectItem>
                    <SelectItem value="Paraguay">Paraguay</SelectItem>
                    <SelectItem value="Russia">Russia</SelectItem>
                    <SelectItem value="Taiwan">Taiwan</SelectItem>
                    <SelectItem value="Antarctica">Antarctica</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Cameroon">Cameroon</SelectItem>
                    <SelectItem value="Puerto Rico">Puerto Rico</SelectItem>
                    <SelectItem value="Venezuela">Venezuela</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Micronesia">Micronesia</SelectItem>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                    <SelectItem value="Poland">Poland</SelectItem>
                    <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                    <SelectItem value="Peru">Peru</SelectItem>
                    <SelectItem value="Chile">Chile</SelectItem>
                    <SelectItem value="Thailand">Thailand</SelectItem>
                    <SelectItem value="Morocco">Morocco</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                    <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                    <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="Greenland">Greenland</SelectItem>
                    <SelectItem value="Ireland">Ireland</SelectItem>
                    <SelectItem value="Panama">Panama</SelectItem>
                    <SelectItem value="French Polynesia">French Polynesia</SelectItem>
                    <SelectItem value="Greece">Greece</SelectItem>
                    <SelectItem value="Zambia">Zambia</SelectItem>
                    <SelectItem value="Tanzania">Tanzania</SelectItem>
                    <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                    <SelectItem value="Kenya">Kenya</SelectItem>
                    <SelectItem value="Netherlands Antilles">Netherlands Antilles</SelectItem>
                    <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                    <SelectItem value="Albania">Albania</SelectItem>
                    <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
                    <SelectItem value="Bolivia">Bolivia</SelectItem>
                    <SelectItem value="Cyprus">Cyprus</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                    <SelectItem value="Honduras">Honduras</SelectItem>
                    <SelectItem value="Ecuador">Ecuador</SelectItem>
                    <SelectItem value="Norway">Norway</SelectItem>
                    <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                    <SelectItem value="Kyrgyzstan">Kyrgyzstan</SelectItem>
                    <SelectItem value="Uganda">Uganda</SelectItem>
                    <SelectItem value="Guatemala">Guatemala</SelectItem>
                    <SelectItem value="Korea, South">Korea, South</SelectItem>
                    <SelectItem value="Fiji">Fiji</SelectItem>
                    <SelectItem value="Papua New Guinea">Papua New Guinea</SelectItem>
                    <SelectItem value="Egypt">Egypt</SelectItem>
                    <SelectItem value="Haiti">Haiti</SelectItem>
                    <SelectItem value="Guam">Guam</SelectItem>
                    <SelectItem value="Tajikstan">Tajikstan</SelectItem>
                    <SelectItem value="Ukraine">Ukraine</SelectItem>
                    <SelectItem value="Guinea">Guinea</SelectItem>
                    <SelectItem value="Iran">Iran</SelectItem>
                    <SelectItem value="Cayman Islands">Cayman Islands</SelectItem>
                    <SelectItem value="Madagascar">Madagascar</SelectItem>
                    <SelectItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</SelectItem>
                    <SelectItem value="Rwanda">Rwanda</SelectItem>
                    <SelectItem value="Belize">Belize</SelectItem>
                    <SelectItem value="Bahamas">Bahamas</SelectItem>
                    <SelectItem value="Jordan">Jordan</SelectItem>
                    <SelectItem value="Jamaica">Jamaica</SelectItem>
                    <SelectItem value="Iceland">Iceland</SelectItem>
                    <SelectItem value="Macedonia,Former Yugoslav Rep.">Macedonia,Former Yugoslav Rep.</SelectItem>
                    <SelectItem value="Central African Republic">Central African Republic</SelectItem>
                    <SelectItem value="Congo">Congo</SelectItem>
                    <SelectItem value="Romania">Romania</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Howland Island">Howland Island</SelectItem>
                    <SelectItem value="Croatia">Croatia</SelectItem>
                    <SelectItem value="Benin">Benin</SelectItem>
                    <SelectItem value="Senegal">Senegal</SelectItem>
                    <SelectItem value="Cambodia">Cambodia</SelectItem>
                    <SelectItem value="Malawi">Malawi</SelectItem>
                    <SelectItem value="Worldwide">Worldwide</SelectItem>
                    <SelectItem value="Antigua and Barbuda">Antigua and Barbuda</SelectItem>
                    <SelectItem value="Dominica">Dominica</SelectItem>
                    <SelectItem value="Czech Republic">Czech Republic</SelectItem>
                    <SelectItem value="Falkland Islands">Falkland Islands</SelectItem>
                    <SelectItem value="Hungary">Hungary</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                    <SelectItem value="Sudan">Sudan</SelectItem>
                    <SelectItem value="Barbados">Barbados</SelectItem>
                    <SelectItem value="Southeast Asia">Southeast Asia</SelectItem>
                    <SelectItem value="Lebanon">Lebanon</SelectItem>
                    <SelectItem value="Philippines">Philippines</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                    <SelectItem value="Nepal">Nepal</SelectItem>
                    <SelectItem value="Solomon Islands">Solomon Islands</SelectItem>
                    <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
                    <SelectItem value="Sierra Leone">Sierra Leone</SelectItem>
                    <SelectItem value="Ivory Coast">Ivory Coast</SelectItem>
                    <SelectItem value="Mongolia">Mongolia</SelectItem>
                    <SelectItem value="Burma">Burma</SelectItem>
                    <SelectItem value="Qatar">Qatar</SelectItem>
                    <SelectItem value="Botswana">Botswana</SelectItem>
                    <SelectItem value="Namibia">Namibia</SelectItem>
                    <SelectItem value="Mali">Mali</SelectItem>
                    <SelectItem value="Armenia">Armenia</SelectItem>
                    <SelectItem value="Congo">Congo</SelectItem>
                    <SelectItem value="Cuba">Cuba</SelectItem>
                    <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                    <SelectItem value="Aruba">Aruba</SelectItem>
                    <SelectItem value="Mozambique">Mozambique</SelectItem>
                    <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                    <SelectItem value="Samoa">Samoa</SelectItem>
                    <SelectItem value="Montenegro">Montenegro</SelectItem>
                    <SelectItem value="El Salvador">El Salvador</SelectItem>
                    <SelectItem value="Iraq">Iraq</SelectItem>
                    <SelectItem value="Vanuatu">Vanuatu</SelectItem>
                    <SelectItem value="Virgin Islands">Virgin Islands</SelectItem>
                    <SelectItem value="Liberia">Liberia</SelectItem>
                    <SelectItem value="Turkmenistan">Turkmenistan</SelectItem>
                    <SelectItem value="New Caledonia">New Caledonia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-full">
                <Label>Start Year</Label>
                <Slider
                  min={2000}
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
                  min={2000}
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

