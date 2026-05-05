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

    function handleFilter(e){
        e.preventDefault()
        router.get(route('head_report_page'),{
            start_date: data.start_date,
            end_date: data.end_date
        })
    }

    function handleSearch(e){
        setSearch(e.target.value)
        router.get(route('head_report_page'), {search: e.target.value})
    }

    useEffect(() => {
        if(error){
            const timer = setTimeout(() => {
                setError(null)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [error])
    return(
    <SidebarLayout>
    <div className="flex-col flex overflow-auto">
        <h3 className="font-bold text-lg m-4">Report</h3>
        {error && (<div className="alert alert-error mb-4">
                {error}
            </div>)}
        {/* Search button */}
              <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
        
                <div>
                    <SearchField value={search} onChange={handleSearch} placeholder="Search items..."/>
        
                    <p className="mt-4">
                    You searched: {search}
                    </p>
                </div>
                <div className="">
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

                    return Object.values(grouped || {}).map(history => (
                        <tr key={history.item_id}>
                            <td>{history.item_id}</td>
                            <td>{item.description}</td>
                            <td>{history.unit_of_measure}</td>
                            <td>{history.beginning_inventory}</td>
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