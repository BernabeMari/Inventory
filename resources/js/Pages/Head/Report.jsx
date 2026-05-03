import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function(){
    const [search, setSearch] = useState('')
    const [createItemModal, setcreateItemModal] = useState(false)
    const [editItemModal, seteditItemModal] = useState(false)
    const [addReceiptModal, setaddReceiptModal] = useState(null)
    const {beginnings, items, issuances, quantities, history, flash} = usePage().props
    const {post, data, setData, reset} = useForm({
        unit_of_measure: '',
        description: '',
        total: '',
        quantity: [''],
        start_date: null,
        end_date: null
    })

    return(
    <SidebarLayout>
    <div className="flex-col flex overflow-auto">
        <h3 className="font-bold text-lg m-4">Create Item</h3>
        {flash.success && (
            <div className="alert alert-success mb-4">
                {flash.success}
            </div>
        )}
        {/* Search button */}
              <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
        
                <div>
                    <SearchField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..."/>
        
                    <p className="mt-4">
                    You searched: {search}
                    </p>
                </div>
                <div className="">
                    <input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)}/> - <input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)}/>
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
                    item.history?.map(history => (
                        <tr> 


                <td>
                    <div className="font-bold">
                        {history.id}
                    </div>
                </td>


                <td>
                    <div className="font-bold">
                        {history.description}
                    </div>
                </td>


                <td>
                    <div className="font-bold">
                        {history.unit_of_measure}
                    </div>
                </td>
               
               <td>
                    <div className="font-bold">
                        {beginnings[history.id] ?? 0}
                    </div>
                </td>

                <td>
                     <div className="flex justify-between items-center">
                        {history.add_receipts?.join(' + ')}
                    </div>
                </td>

                <td>
                    <div className="font-bold">
                       {history.total}
                    </div>
                </td>
                
                
                <td>
                    <div className="font-bold">
                       {history.less}
                    </div>
                </td>
                
                <td>
                    <div className="font-bold">
                       {history.total - history.less}
                    </div>
                </td>

                </tr>
                    ))
                ))}
            </tbody>
            </table>
        </div>
    </div>
    </SidebarLayout>
    )
}