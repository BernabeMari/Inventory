import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

export default function(){
    const [search, setSearch] = useState('')
    const {requests} = usePage().props
    return(
        <SidebarLayout>
            <div className="flex-col flex overflow-auto">
                <h3 className="font-bold text-lg m-4">Done Requests</h3>
                {/* Search button */}
                <div className="p-4">          
                    <SearchField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..."/>
                        <p className="mt-4">You searched: {search}</p>
                </div>

                {/* Table */}
                <div className="flex justify-center items-center">
           
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                            <th>REQUEST NO.</th>
                            <th>DEPARTMENT</th>
                            <th>REQUEST</th>
                            <th>QUANTITY OF REQUEST</th>
                            <th>ISSUED ITEM</th>
                            <th>ISSUED QUANTITY</th>
                            <th>UNFULFILLED QUANTITY</th>
                            <th>STATUS</th>
                            <th>MESSAGE</th>
                            </tr>
                        </thead>
                        <tbody>
                        {requests.filter(request => request.status === 'approved' || request.status === 'rejected').filter(request => request.status.toLowerCase().includes(search.toLowerCase()) || request.user?.department.toLowerCase().includes(search.toLowerCase()) || request.message && request.message.toLowerCase().includes(search.toLowerCase()) || request.item.toLowerCase().includes(search.toLowerCase())).map(request => (
                            <tr> 
                                
                                <td>
                                    <div className="font-bold">
                                        {request.id}
                                    </div>
                                </td>
                               
                                <td>
                                    <div className="font-bold">
                                        {request.user?.department}
                                    </div>
                                </td>
                                
                                <td>
                                    <div className="font-bold">
                                        {request.item}
                                    </div>
                                </td>
                               
                                <td>
                                    <div className="font-bold">
                                        {request.quantity}
                                    </div>
                                </td>
                                
                                
                                <td>
                                    <div className="font-bold">
                                        {request.issued_item}
                                    </div>
                                </td>
                                
                                
                                <td>
                                    <div className="font-bold">
                                        {request.fulfilled_quantity}
                                    </div>
                                </td>
                                
                                
                                <td>
                                    <div className="font-bold">
                                        {request.unfulfilled_quantity}
                                    </div>
                                </td>
                                
                                
                                <td>
                                    <div className="font-bold">
                                        {request.status}
                                    </div>
                                </td>
                                
                                
                                <td>
                                    <div className="font-bold">
                                        {request.message}
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