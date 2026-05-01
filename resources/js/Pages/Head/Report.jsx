import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function(){
    const [search, setSearch] = useState('')
    const [createItemModal, setcreateItemModal] = useState(false)
    const [editItemModal, seteditItemModal] = useState(false)
    const [addReceiptModal, setaddReceiptModal] = useState(null)
    const {beginnings, items, receivers, flash} = usePage().props
    const {post, data, setData, reset} = useForm({
        unit_of_measure: '',
        description: '',
        total: '',
        quantity: [''],
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
              <div className="p-4">
        
                <SearchField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search items..."
                />
        
                <p className="mt-4">
                  You searched: {search}
                </p>
        
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
                <tr> 


                <td>
                    <div className="font-bold">
                        {item.id}
                    </div>
                </td>


                <td>
                    <div className="font-bold">
                        {item.description}
                    </div>
                </td>


                <td>
                    <div className="font-bold">
                        {item.unit_of_measure}
                    </div>
                </td>
               
               <td>
                    <div className="font-bold">
                        {beginnings[item.id] ?? 0}
                    </div>
                </td>

                <td>
                     <div className="flex justify-between items-center">
                        {item.quantity.join(" + ")} 
                    </div>
                </td>

                <td>
                    <div className="font-bold">
                       {item.total}
                    </div>
                </td>
                
                
                <td>
                    <div className="font-bold">
                       {item.less}
                    </div>
                </td>
                
                <td>
                    <div className="font-bold">
                       {item.total - item.less}
                    </div>
                </td>

                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
    </SidebarLayout>
    )
}