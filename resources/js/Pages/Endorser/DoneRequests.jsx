import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function(){
    const [search, setSearch] = useState('')
    const {requests} = usePage().props

    function handleSearch(e){
        setSearch(e.target.value)
        router.get(route('endorser_done_request_page'), {search: e.target.value})
    }
    return(
        <SidebarLayout>
            <div className="flex-col flex overflow-auto">
                <h3 className="font-bold text-lg m-4">Done Requests</h3>
                {/* Search button */}
            <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                    <SearchField value={search} onChange={handleSearch} placeholder="Search requests..."/>
                    <p className="mt-4">
                    You searched: {search}
                    </p> 
                </div>

                <div className="gap-5 flex">
                    <button value={''} onClick={handleSearch} className="btn bg-slate-500 p-2 text-white hover:bg-slate-600">
                        All
                    </button>
                    <button value={'approved'} onClick={handleSearch} className="btn bg-green-500 p-2 text-white hover:bg-green-600">
                        Approved
                    </button>
                    <button value={'rejected'} onClick={handleSearch} className="btn bg-red-500 p-2 text-white hover:bg-red-600">
                        Rejected
                    </button>
                    <button value={'cancelled'} onClick={handleSearch} className="btn bg-gray-500 p-2 text-white hover:bg-gray-600">
                        Cancelled
                    </button>
                </div>
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
                        {requests.map(request => (
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