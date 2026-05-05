import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function(){
    const [search, setSearch] = useState('')
    const [saveModal, setSaveModal] = useState(false)
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

    function resetInventory(e){
        e.preventDefault()  
        post(route('reset_inventory'), {less: 0, add_receipts: []})
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


                {/* save button */}
                <div className="absolute top-0 right-0">
                    <button onClick={(e) => {setSaveModal(true); setData({id: data.id})}} className="btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                    </svg>
                    </button>
                </div>
                

                {/* saveModal */}
            {saveModal && (
                <dialog className="modal modal-open">
                <div className="modal-box">
                    <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setSaveModal(false)}
                    >
                    ✕
                    </button>

                    <form onSubmit={resetInventory} className="flex flex-col gap-4">
                        <p>Are you sure you want to <p className="badge badge-ghost bold badge-xl">SAVE</p> current</p>                 
                                <div className="flex flex-row gap-10 justify-center">
                                    <button type="submit" className="btn btn-success w-10">Yes</button>
                                    <button onClick={() => setSaveModal(false)} className="btn btn-error w-10">No</button>
                                </div>
                    </form>
                
                </div>
                </dialog>
            )}


                
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