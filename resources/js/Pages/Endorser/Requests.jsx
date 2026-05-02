import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function(){
    const [approveModal, setapproveModal] = useState(false)
    const [rejectModal, setrejectModal] = useState(false)
    const { flash, requests, receiver, items } = usePage().props
    const [search, setSearch] = useState('')
    const {post, data, setData} = useForm({
        status: '',
        item_id: [''],
        request_id: '',
        item: '',
        fulfilled_quantity: [],
        unfulfilled_quantity: [],
        endorser_message: '',
        available_item: '',
    })

    function reject(e){
        e.preventDefault()
        post(route('action_reject'), {
            onSuccess: () => setrejectModal(false)
        })
    }
    
    function approve(e){
        e.preventDefault()
        post(route('action_approve'), {
            onSuccess: () => setapproveModal(false)
        })
    }
    return(
    <SidebarLayout>
         <div className="flex-col flex overflow-auto">
            <h3 className="font-bold text-lg m-4">Requests</h3>
        {flash.error && (<div className="alert alert-error mb-4">
        {flash.error}
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
                        <th></th>
                        <th>DEPARTMENT</th>
                        <th>REQUEST</th>
                        <th>QUANTITY OF REQUEST</th>
                        <th>STATUS</th>
                        <th>MESSAGE</th>
                        <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.filter(request => request.status === 'pending').filter(request => request.status.toLowerCase().includes(search.toLowerCase()) || request.user?.department?.toLowerCase().includes(search.toLowerCase()) || request.message && request.message.toLowerCase().includes(search.toLowerCase()) || request.item?.some(item => item.toLowerCase().includes(search.toLowerCase()))).map(request => (
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
                            <div className="font-bold flex-row flex items-center gap-2">
                                {request.user?.department}
                            </div>
                        </td>
        
        
                        <td>
                            <div className="font-bold">
                                {request.item.join(', ')}
                            </div>
                        </td>
        
        
                        <td>
                            <div className="font-bold">
                               {request.quantity.join(', ')}
                            </div>
                        </td>
                        
                        
                        <td>
                            <div className="font-bold">
                               {request.status === 'pending' ? (
                                    <span className="text-yellow-500">{request.status}</span>
                                ) : request.status === 'approved' ? (
                                    <span className="text-green-500">{request.status}</span>
                                ) : (
                                    <span className="text-red-500">{request.status}</span>
                                )}
                            </div>
                        </td>
                       
                       
                        <td>
                            <div className="font-bold">
                               {request.message}
                            </div>
                        </td>
                       
                        <td>
                            <div className="font-bold flex-row flex">
                                <div className="tooltip tooltip-close tooltip-right">
                                    <button onClick={(e) => {setapproveModal(true); setData({issuance_id: request.issuances?.id || null, request_id: request.id, item: request.item, item_id: Array(request.item.length).fill(''), fulfilled_quantity: request.fulfilled_quantity || [], unfulfilled_quantity: request.unfulfilled_quantity || []})}} className="btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    </button>
                                </div>

                                <div className="tooltip tooltip-close tooltip-right">
                                    <button onClick={(e) => {setrejectModal(true); setData({request_id: request.id})}} className="btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
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


                             <form onSubmit={approve} className="flex flex-col gap-4">
                                <h3 className="font-bold text-lg m-4">Approve Request({data.item}){data.item_id}</h3>

                                {data.item.map((row, index) => (
                                    <div key={index} className="flex flex-row gap-4">
                                        <select value={data.item_id[index] || ""} onChange={(e) => {
                                            const itemIds = [...(data.item_id || [])];
                                            itemIds[index] = e.target.value;
                                            setData('item_id', itemIds);
                                        }} required className="select select-ghost" >
                                            
                                            <option value="" disabled>
                                                Select an Item
                                            </option>

                                            {items.map(item => (
                                                <option key={item.id} value={item.id}>
                                                {item.description} - ({item.total})
                                                </option>
                                            ))}
                                        </select>
                                
                                    <label className="input validator">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                                    </svg>
                                    <input value={data.fulfilled_quantity[index] ?? ''} onChange={(e) => {const newFulfilled = [...(data.fulfilled_quantity || [])]; newFulfilled[index] = e.target.value; setData('fulfilled_quantity', newFulfilled);}} type="number" min={0} required placeholder="Issue Quantity" title="Put Issue Quantity Here"/>
                                    </label>  
                                    
                                    
                                    <label className="input validator">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                    <input type="number" value={data.unfulfilled_quantity[index] ?? ''} onChange={(e) => {const newUnfulfilled = [...(data.unfulfilled_quantity || [])]; newUnfulfilled[index] = e.target.value; setData('unfulfilled_quantity', newUnfulfilled);}} min={0} required placeholder="Unfulfilled Quantity" title="Put Unfulfilled Quantity Here"/>
                                    </label>  
                                </div>

                                ))}
                                
                                    <div className="flex justify-center">
                                        <label className="input validator">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>
                                        <input value={data.endorser_message} onChange={(e) => setData('endorser_message', e.target.value)} type="text" placeholder="Message(optional)" title="Input Message Here"/>
                                        </label>
                                    </div>

                                <div className="flex flex-row gap-10 mt-5 justify-center">
                                <button type="submit" className="btn btn-success w-10">Yes</button>
                                <button onClick={() => setapproveModal(false)} className="btn btn-error w-10">No</button>
                                </div>
                            </form>


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
                            <p>Are you sure you want to <p className="badge badge-ghost badge-xl">REJECT</p> this request?</p>
                            <form onSubmit={reject} className="flex flex-col mt-5 justify-center">
                                
                                <label className="input validator">
                                <p>Enter Reason for rejecting: </p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                    <input value={data.endorser_message} onChange={(e) => setData('endorser_message', e.target.value)} type="text" min={0} required placeholder="Issue Quantity" title="Put Issue Quantity Here"/>
                                </label> 

                                <div className="flex flex-row gap-10 justify-center">
                                    <button className="btn btn-success w-10">Yes</button>
                                    <button onClick={() => setrejectModal(false)} className="btn btn-error w-10">No</button>
                                </div>
                            </form>
                        </div>
                        </dialog>
                    )}

                </div>
            </div>
    </SidebarLayout>
    )
}