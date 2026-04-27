import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

export default function(){
    const [approveModal, setapproveModal] = useState(false)
    const [rejectModal, setrejectModal] = useState(false)
    const { users, requests } = usePage().props
    const [search, setSearch] = useState('')
    return(
    <SidebarLayout>
         <div className="flex-col flex overflow-auto">
        
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
                        <th>REQUEST NO.</th>
                        <th>DEPARTMENT</th>
                        <th>REQUEST</th>
                        <th>QUANTITY OF REQUEST</th>
                        <th>STATUS</th>
                        <th>MESSAGE</th>
                        <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.filter(request => request.message.toLowerCase().includes(search.toLowerCase())).map(request => (
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
                               {request.status}
                            </div>
                        </td>
                       
                       
                        <td>
                            <div className="font-bold">
                               {request.message}
                            </div>
                        </td>
                        
                        {console.log(request) }
                        <td>
                            <div className="font-bold flex-row flex">
                                <div className="tooltip tooltip-close tooltip-right">
                                    <button onClick={(e) => setapproveModal(true)} className="btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    </button>
                                </div>

                                <div className="tooltip tooltip-close tooltip-right">
                                    <button onClick={(e) => setrejectModal(true)} className="btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                    </button>
                                </div>
                            </div>
                        </td>
        
                        </tr>
                     ))}
                    </tbody>
                    </table>

                {/* Approve Modal */}
                     {approveModal && (
                        <dialog className="modal modal-open">
                        <div className="modal-box">
                            <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setapproveModal(false)}
                            >
                            ✕
                            </button>
                            <p>Approve this request</p>
                            <div className="flex flex-row justify-center">
                            <button className="btn btn-success w-10">Yes</button>
                            <button onClick={() => setapproveModal(false)} className="btn btn-error w-10">No</button>
                            </div>
                        </div>
                        </dialog>
                    )}
                
                
                {/* Reject Modal */}
                     {rejectModal && (
                        <dialog className="modal modal-open">
                        <div className="modal-box">
                            <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setrejectModal(false)}
                            >
                            ✕
                            </button>
                            <p>Approve this request</p>
                            <div className="flex flex-row justify-center">
                            <button className="btn btn-success w-10">Yes</button>
                            <button onClick={() => setrejectModal(false)} className="btn btn-error w-10">No</button>
                            </div>
                        </div>
                        </dialog>
                    )}

                </div>
            </div>
    </SidebarLayout>
    )
}