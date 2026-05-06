import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function(){
    const [search, setSearch] = useState('')
    const {beginnings, items, flash} = usePage().props
    const [error, setError] = useState(flash.error)
    const {post, data, setData, reset} = useForm({
        unit_of_measure: '',
        description: '',
        total: '',
        quantity: [''],
        start_date: null,
        end_date: null
    })

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

    return(
    <SidebarLayout>
    <div className="flex-col flex overflow-auto relative">
        <h3 className="font-bold text-lg m-4">Report</h3>
        {flash.error && (<div className="alert alert-error mb-4">
                {flash.error}
            </div>)}
            
        {/* Search button */}
              <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
        
                <div>
                    <SearchField value={search} onChange={handleSearch} placeholder="Search items..."/>
        
                    <p className="mt-4">
                    You searched: {search}
                    </p>
                </div>

                <div className="absolute top-0 right-0">
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
                {items.map(item => {
                    const grouped = item.history?.reduce((acc, h) => {
                        if(!acc[h.item_id]){
                            acc[h.item_id] = {...h, total: 0, less: 0, add_receipts: []}
                        }

                        acc[h.item_id].total += h.total || 0;
                        acc[h.item_id].less += h.less || 0;
                        acc[h.item_id].add_receipts = [
                            ...acc[h.item_id].add_receipts,
                            ...(h.add_receipts || [])
                        ];

                        return acc;
                    }, {});
                    const lastHistory = item.history[item.history.length - 1];
                    return Object.values(grouped || {}).map(history => (
                        <tr key={history.item_id}>
                            <td>{history.item_id}</td>
                            <td>{item.description}</td>
                            <td>{history.unit_of_measure}</td>
                            <td>{lastHistory?.beginning_inventory}</td>
                            <td>{history.add_receipts.join(' + ')}</td>
                            <td>{history.total}</td>
                            <td>{history.less}</td>
                            <td>{history.total - history.less}</td>
                        </tr>
                    ));
                })}
            </tbody>
            </table>
        </div>
    </div>
    </SidebarLayout>
    )
}