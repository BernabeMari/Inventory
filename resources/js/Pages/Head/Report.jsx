import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function(){
    const [search, setSearch] = useState('')
    const {items = [], flash = {}, start_date: reportStartDate = '', end_date: reportEndDate = ''} = usePage().props
    const [error, setError] = useState(flash.error)
    const today = new Date().toISOString().split('T')[0]
    const {post, data, setData, reset} = useForm({
        unit_of_measure: '',
        description: '',
        total: '',
        quantity: [''],
        start_date: reportStartDate || today,
        end_date: reportEndDate || today
    })

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const startDate = params.get('start_date') || reportStartDate || today
        const endDate = params.get('end_date') || reportEndDate || today
        setData({
            ...data,
            start_date: startDate,
            end_date: endDate
        })
    }, [])

    function getCurrentFilters(extra = {}) {
        const params = new URLSearchParams(window.location.search)

        return {
            start_date: data.start_date || params.get('start_date') || '',
            end_date: data.end_date || params.get('end_date') || '',
            search: search || params.get('search') || '',
            ...extra,
        }
    }

    function handleFilter(e){
        e.preventDefault()
        router.get(route('head_report_page'), getCurrentFilters())
    }

    function handleSearch(e){
        const nextSearch = e.target.value
        setSearch(nextSearch)
        router.get(route('head_report_page'), getCurrentFilters({ search: nextSearch }))
    }

    function downloadPDF(e){
        e.preventDefault()
        const params = new URLSearchParams(getCurrentFilters())
        window.location.href = `${route('download_report_pdf')}?${params.toString()}`
    }

    function downloadSpreadsheet(e){
        e.preventDefault()
        const params = new URLSearchParams(getCurrentFilters())
        window.location.href = `${route('download_report_spreadsheet')}?${params.toString()}`
    }

    return(
    <SidebarLayout>
    <div className="flex-col flex overflow-auto relative">
        <h3 className="font-bold text-3xl m-4 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent">Report</h3>
        {flash.error && (<div className="bg-red-100 border-2 border-red-400 text-red-800 mb-4 rounded-lg p-4">
                {flash.error}
            </div>)}
            
        {/* Search button */}
              <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
        
                <div>
                    <SearchField value={search} onChange={handleSearch} placeholder="Search items..."/>
        
                    <p className="mt-4">
                    You searched: {search}
                    </p>
                    <p className="mt-2 text-sm opacity-70">
                    Report date: {data.start_date}
                    </p>
                </div>

                <div className="absolute top-0 right-0">
                    <div className="flex flex-row gap-2">
                    <button onClick={downloadSpreadsheet} className="flex flex-row gap-3 btn btn-outline" type="button">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                            </svg>
                        </div>
                        <div>
                            Spreadsheet
                        </div>
                    </button>
                    <button onClick={downloadPDF} className="flex flex-row gap-3 btn" type="button">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>
                        <div>
                            Download PDF
                        </div>
                    </button>
                    </div>
                </div>
                <div>
                    <form onSubmit={handleFilter}>
                        <input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)}/> - <input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)}/>                    
                        <button type="submit" className="btn btn-primary ml-4">Filter Report</button>
                    </form> 
              </div>
              </div>


        {/* Table */}
        <div className="flex justify-center items-center">
            <table className="table">
            {/* head */}
            <thead>
                <tr>
                <th>ITEM NO.</th>
                <th>DESCRIPTION</th>
                <th>UNIT OF MEASURE</th>
                <th>BEGINNING INVENTORY</th>
                <th>ADD:RECEIPTS</th>
                <th>TOTAL</th>
                <th>LESS: ISSUANCE</th>
                <th>ENDING BALANCE</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.description}</td>
                        <td>{item.unit_of_measure}</td>
                        <td>{item.beginning_inventory}</td>
                        <td>{item.added_receipt}</td>
                        <td>{item.total}</td>
                        <td>{item.less}</td>
                        <td>{item.ending_balance}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
    </SidebarLayout>
    )
}