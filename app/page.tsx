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
  const [activeTab, setActiveTab] = useState('award')
  const router = useRouter();
  
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
    router.push("/api/awards")
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
                    <SelectItem value="none">Select one</SelectItem>
                    <SelectItem value="06020000">AGS - Div Atmospheric & Geospace Sciences</SelectItem>
                    <SelectItem value="14030000">ANT - Antarctic Sciences Division</SelectItem>
                    <SelectItem value="14010000">ARC - Arctic Sciences Division</SelectItem>
                    <SelectItem value="03020000">AST - Division Of Astronomical Sciences</SelectItem>
                    <SelectItem value="04040000">BCS - Division Of Behavioral and Cognitive Sci</SelectItem>
                    <SelectItem value="10000000">BFA - Office of Budget, Finance, & Award Management</SelectItem>
                    <SelectItem value="08000000">BIO - Direct For Biological Sciences</SelectItem>
                    <SelectItem value="07020000">CBET - Div Of Chem, Bioeng, Env, & Transp Sys</SelectItem>
                    <SelectItem value="05010000">CCF - Division of Computing and Communication Foundations</SelectItem>
                    <SelectItem value="03090000">CHE - Division Of Chemistry</SelectItem>
                    <SelectItem value="07030000">CMMI - Div Of Civil, Mechanical, & Manufact Inn</SelectItem>
                    <SelectItem value="05050000">CNS - Division Of Computer and Network Systems</SelectItem>
                    <SelectItem value="05000000">CSE - Direct For Computer & Info Scie & Enginr</SelectItem>
                    <SelectItem value="10040000">DACS - Division of Acquisition & Cooperative Support</SelectItem>
                    <SelectItem value="02060000">DAS - Division Of Administrative Services</SelectItem>
                    <SelectItem value="08080000">DBI - Div Of Biological Infrastructure</SelectItem>
                    <SelectItem value="16010000">DDAI - Div of Data and Artificial Intelligence</SelectItem>
                    <SelectItem value="08010000">DEB - Division Of Environmental Biology</SelectItem>
                    <SelectItem value="16020000">DES - Division of Enterprise Services</SelectItem>
                    <SelectItem value="10020000">DFM - Division of Financial Management</SelectItem>
                    <SelectItem value="10030000">DGA - Division of Grants and Agreements</SelectItem>
                    <SelectItem value="11010000">DGE - Division Of Graduate Education</SelectItem>
                    <SelectItem value="10050000">DIAS - Division of Institution & Award Support</SelectItem>
                    <SelectItem value="02090000">DIS - Division Of Information Systems</SelectItem>
                    <SelectItem value="03070000">DMR - Division Of Materials Research</SelectItem>
                    <SelectItem value="03040000">DMS - Division Of Mathematical Sciences</SelectItem>
                    <SelectItem value="10010000">DOB - Budget Division</SelectItem>
                    <SelectItem value="11090000">DRL - Division Of Research On Learning</SelectItem>
                    <SelectItem value="16030000">DSO - Division of Security & Operations</SelectItem>
                    <SelectItem value="11040000">DUE - Division Of Undergraduate Education</SelectItem>
                    <SelectItem value="06030000">EAR - Division Of Earth Sciences</SelectItem>
                    <SelectItem value="07010000">ECCS - Div Of Electrical, Commun & Cyber Sys</SelectItem>
                    <SelectItem value="11000000">EDU - Directorate for STEM Education</SelectItem>
                    <SelectItem value="07050000">EEC - Div Of Engineering Education and Centers</SelectItem>
                    <SelectItem value="11060000">EES - Div. of Equity for Excellence in STEM</SelectItem>
                    <SelectItem value="08040000">EF - Emerging Frontiers</SelectItem>
                    <SelectItem value="07040000">EFMA - Emerging Frontiers & Multidisciplinary Activities</SelectItem>
                    <SelectItem value="07000000">ENG - Directorate For Engineering</SelectItem>
                    <SelectItem value="06000000">GEO - Directorate For Geosciences</SelectItem>
                    <SelectItem value="02040000">HRM - Division Of Human Resource Management</SelectItem>
                    <SelectItem value="07070000">IIP - Div Of Industrial Innovation & Partnersh</SelectItem>
                    <SelectItem value="05020000">IIS - Div Of Information & Intelligent Systems</SelectItem>
                    <SelectItem value="08090000">IOS - Division Of Integrative Organismal Systems</SelectItem>
                    <SelectItem value="02000000">IRM - Office Of Information & Resource Mgmt</SelectItem>
                    <SelectItem value="15020000">ITE - Innovation and Technology Ecosystems</SelectItem>
                    <SelectItem value="05100000">ITR - CISE Information Technology Research</SelectItem>
                    <SelectItem value="01050000">LPA - Office Of Legislative & Public Affairs</SelectItem>
                    <SelectItem value="08070000">MCB - Div Of Molecular and Cellular Bioscience</SelectItem>
                    <SelectItem value="03000000">MPS - Direct For Mathematical & Physical Scien</SelectItem>
                    <SelectItem value="12000000">NCO - National Coordination Office</SelectItem>
                    <SelectItem value="04030000">NCSE - National Center For S&E Statistics</SelectItem>
                    <SelectItem value="13000000">NNCO - Natl Nanotechnology Coordinating Office</SelectItem>
                    <SelectItem value="00010000">NSB - National Science Board</SelectItem>
                    <SelectItem value="01000000">O/D - Office Of The Director</SelectItem>
                    <SelectItem value="05090000">OAC - Office of Advanced Cyberinfrastructure (OAC)</SelectItem>
                    <SelectItem value="06040000">OCE - Division Of Ocean Sciences</SelectItem>
                    <SelectItem value="01110000">OCI - Office Of Cyberinfrastructure</SelectItem>
                    <SelectItem value="16000000">OCIO - Office of the Chief Information Officer</SelectItem>
                    <SelectItem value="01070000">OECR - OECR-Office of Equity & Civil Rights</SelectItem>
                    <SelectItem value="01010000">OGC - General Counsel</SelectItem>
                    <SelectItem value="01060000">OIA - OIA-Office of Integrative Activities</SelectItem>
                    <SelectItem value="00020000">OIG - Office Of Inspector General</SelectItem>
                    <SelectItem value="01090000">OISE - Office Of Internatl Science &Engineering</SelectItem>
                    <SelectItem value="14000000">OPP - Office Of Polar Programs</SelectItem>
                    <SelectItem value="06090000">OPP - Office of Polar Programs (OPP)</SelectItem>
                    <SelectItem value="03060000">OSI - Office of Strategic Initiatives (OSI)</SelectItem>
                    <SelectItem value="14040000">PEHS - Polar Environment,Health & Safety Office</SelectItem>
                    <SelectItem value="03010000">PHY - Division Of Physics</SelectItem>
                    <SelectItem value="99990000">PYRL - NSF Payroll Organization</SelectItem>
                    <SelectItem value="10060000">RIO - Research Infrastructure Office</SelectItem>
                    <SelectItem value="06010000">RISE - Div of Res, Innovation, Synergies, & Edu</SelectItem>
                    <SelectItem value="04000000">SBE - Direct For Social, Behav & Economic Scie</SelectItem>
                    <SelectItem value="04050000">SES - Divn Of Social and Economic Sciences</SelectItem>
                    <SelectItem value="04010000">SMA - SBE Off Of Multidisciplinary Activities</SelectItem>
                    <SelectItem value="15040000">SPH - Strategic Partnerships Hub</SelectItem>
                    <SelectItem value="15010000">TF - Technology Frontiers</SelectItem>
                    <SelectItem value="15030000">TI - Translational Impacts</SelectItem>
                    <SelectItem value="15000000">TIP - Dir for Tech, Innovation, & Partnerships</SelectItem>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Select onValueChange={(value) => setSearchQuery((prev) => ({...prev, state: value}))} value={searchQuery.state}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="AK">Alaska</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                    <SelectItem value="AR">Arkansas</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="CO">Colorado</SelectItem>
                    <SelectItem value="CT">Connecticut</SelectItem>
                    <SelectItem value="DE">Delaware</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="HI">Hawaii</SelectItem>
                    <SelectItem value="ID">Idaho</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="IN">Indiana</SelectItem>
                    <SelectItem value="IA">Iowa</SelectItem>
                    <SelectItem value="KS">Kansas</SelectItem>
                    <SelectItem value="KY">Kentucky</SelectItem>
                    <SelectItem value="LA">Louisiana</SelectItem>
                    <SelectItem value="ME">Maine</SelectItem>
                    <SelectItem value="MD">Maryland</SelectItem>
                    <SelectItem value="MA">Massachusetts</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                    <SelectItem value="MN">Minnesota</SelectItem>
                    <SelectItem value="MS">Mississippi</SelectItem>
                    <SelectItem value="MO">Missouri</SelectItem>
                    <SelectItem value="MT">Montana</SelectItem>
                    <SelectItem value="NE">Nebraska</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="NH">New Hampshire</SelectItem>
                    <SelectItem value="NJ">New Jersey</SelectItem>
                    <SelectItem value="NM">New Mexico</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="ND">North Dakota</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="OK">Oklahoma</SelectItem>
                    <SelectItem value="OR">Oregon</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="RI">Rhode Island</SelectItem>
                    <SelectItem value="SC">South Carolina</SelectItem>
                    <SelectItem value="SD">South Dakota</SelectItem>
                    <SelectItem value="TN">Tennessee</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="UT">Utah</SelectItem>
                    <SelectItem value="VT">Vermont</SelectItem>
                    <SelectItem value="VA">Virginia</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                    <SelectItem value="WV">West Virginia</SelectItem>
                    <SelectItem value="WI">Wisconsin</SelectItem>
                    <SelectItem value="WY">Wyoming</SelectItem>
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
                    {/* Add more countries as needed */}
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

