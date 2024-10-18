import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from 'lucide-react';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'


export default function Sidebar () {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)


    return (
    <>
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

        </>
)
}
