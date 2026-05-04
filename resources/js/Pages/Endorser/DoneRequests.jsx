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
                            <th></th>
                            <th>DEPARTMENT</th>
                            <th>REQUEST</th>
                            <th>QUANTITY OF REQUEST</th>
                            <th>ISSUED ITEM</th>
                            <th>ISSUED QUANTITY</th>
                            <th>UNFULFILLED QUANTITY</th>
                            <th>STATUS</th>
                            <th>MESSAGE</th>
                            <th>ENDORSER'S MESSAGE</th>
                            </tr>
                        </thead>
                        <tbody>
                        {requests.filter(request => request.status !== 'pending').filter(request => request.status.toLowerCase().includes(search.toLowerCase()) || request.user?.department.toLowerCase().includes(search.toLowerCase()) || request.message && request.message.toLowerCase().includes(search.toLowerCase()) || request.item.toLowerCase().includes(search.toLowerCase())).map(request => (
                            <tr> 
                                
                                <td>
                                    <div className="font-bold">
                                    {request.user?.image ? (
                                        <img src={`/storage/${request.user.image}`} alt="" className="ml-2 rounded-full h-10 w-10"/>) 
                                        : (<div className="ml-2 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-gray-600">
                                                    {request.user?.username?.toUpperCase().slice(0, 1)}
                                                </span>
                                            </div>
                                    )}
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
                                        {request.issuances?.map(issuance => issuance.issued_item).join(', ')}
                                    </div>
                                </td>
                                
                                
                                <td>
                                    <div className="font-bold">
                                        {request.issuances?.map(issuance => issuance.fulfilled_quantity).join(', ')}
                                    </div>
                                </td>
                                
                                
                                <td>
                                    <div className="font-bold">
                                        {request.issuances?.map(issuance => issuance.unfulfilled_quantity).join(', ')}
                                    </div>
                                </td>
                                
                                
                                <td>
                                    <div className="font-bold">
                                        {request.status === 'approved' && (
                                            <span className="text-green-500">{request.status}</span>
                                        )}
                                        
                                        {request.status === 'rejected' && (
                                            <span className="text-red-500">{request.status}</span>
                                        )}

                                        {request.status === 'cancelled' && (
                                            <span className="text-orange-500">{request.status}</span>
                                        )}
                                    </div>
                                </td>
                                

                                <td>
                                    <div className="font-bold">
                                        {request.message}
                                    </div>
                                </td>


                                <td>
                                    <div className="font-bold">
                                        {request.endorser_message}
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