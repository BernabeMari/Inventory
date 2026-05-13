import SearchField from "@/Components/SearchField"
import SidebarLayout from "@/Layouts/SidebarLayout"
import { PlusIcon } from "@heroicons/react/24/solid"
import { router, useForm, usePage } from "@inertiajs/react"
import { useState } from "react"
import React from 'react';

export default function({requests}){
    const [requestItem, setrequestItemModal] = useState(false)
    const [cancelModal, setCancelModal] = useState(false)
    const [attachModal, setAttachModal] = useState(false)
    const [selectedAttachRequest, setSelectedAttachRequest] = useState(null)
    const [endorserModal, setEndorserModal] = useState(false)
    const [endorserMessage, setEndorserMessage] = useState('')
    const [search, setSearch] = useState('')
    const {auth, flash} = usePage().props
    const {post, data, setData, reset, processing} = useForm({
        item: [''],
        quantity: [''],
        status: '',
        message: '',
        user_id: '',
        pending: '',
        request_id: '',
        clearance: []
    })

    function request_item(e){
        e.preventDefault()
        post(route('request_item'),{
            onSuccess: ()=>{reset(); setrequestItemModal(false); }
        })
    }

    function cancel_request(e){
        e.preventDefault()
        post(route('cancel_request'),{
            onSuccess: () => setCancelModal(false)
        })
    }

    function attach_file(e){
        e.preventDefault()
        post(route('attach_file'), {
            forceFormData: true,
            onSuccess: () => {
                setAttachModal(false)
                setData('clearance', [])
                setSelectedAttachRequest(null)
            }
        })
    }

    function handleSearch(e){
        setSearch(e.target.value)
        router.get(route('department_page'), {search: e.target.value})
    }
    
    return(
        <SidebarLayout>
        <div className="flex-col flex overflow-auto relative">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#b91c1c]">Department: {auth.user.department}</p>
        <h3 className="font-bold text-3xl m-4 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent">Create Request</h3>
        {flash.success && (
            <div className="alert alert-success mb-4">
                {flash.success}
            </div>
        )}
        {/* Search button */}
        <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
                    <div className="flex flex-row items-center gap-2">
                        <SearchField value={search} onChange={handleSearch} placeholder="Search items..."/><button type="button" value={''} onClick={handleSearch} className="btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg></button>
                    </div>            
                <p className="mt-4">
                You searched: {search}
                </p> 
            </div>

            {/* Add Item Button */}
            <div className="bg-white absolute top-0 right-0 m-6 rounded-full border border-black ">
                <button onClick={(e) => {setrequestItemModal(true);setData({user_id: data.id, item: [''], quantity: ['']})}} className="bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] hover:from-[#6b0d0d] hover:via-[#8b1515] hover:to-[#9c7f0c] text-white font-semibold py-3 px-6 rounded-full transition flex items-center gap-2"><PlusIcon className="w-5 h-5" />Create Request</button>
            </div>

            <div className="gap-5 flex">
                <button value={''} onClick={handleSearch} className="btn bg-slate-500 p-2 text-white hover:bg-slate-600">
                    All
                </button>
                <button value={'pending'} onClick={handleSearch} className="btn bg-yellow-500 p-2 text-white hover:bg-yellow-600">
                    Pending
                </button>
                <button value={'approved'} onClick={handleSearch} className="btn bg-green-500 p-2 text-white hover:bg-green-600">
                    Approved
                </button>
                <button value={'on-hold'} onClick={handleSearch} className="btn bg-orange-500 p-2 text-white hover:bg-orange-600">
                    On Hold
                </button>
                <button value={'for-pickup'} onClick={handleSearch} className="btn bg-emerald-500 p-2 text-white hover:bg-emerald-600">
                    For Pickup
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
            <table className="table border-separate border-spacing-x-16">
            {/* head */}
            <thead>
                <tr>
                <th>YOUR REQUESTS</th>
                <th>QUANTITY</th>
                <th>STATUS</th>
                <th>MESSAGE</th>
                <th>ENDORSER'S MESSAGE</th>
                <th>ACTION</th>
                </tr>
            </thead>
            
            <tbody>
                {requests.map(request => (
                <tr> 

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
                        {request.status === 'pending' && (
                            <span className="text-yellow-500">{request.status}</span>
                        )}
                        {request.status === 'approved' && (
                            <span className="text-green-500">{request.status}</span>
                        )}
                        {request.status === 'rejected' && (
                            <span className="text-red-500">{request.status}</span>
                        )}
                        {request.status === 'cancelled' && (
                            <span className="text-gray-500">{request.status}</span>
                        )}
                        {request.status === 'on-hold' && (
                            <span className="text-orange-500">{request.status}</span>
                        )}
                        {request.status === 'for-pickup' && (
                            <span className="text-emerald-500">Ready for pick up</span>
                        )}
                    </div>
                </td>
                
                
                <td>
                    <div className="font-bold">
                       {request.message}
                    </div>
                </td>
                
                
                <td>
                    <div className="font-bold flex justify-start items-center">
                       {request.endorser_message ? (
                        <button
                            type="button"
                            onClick={() => { setEndorserMessage(request.endorser_message); setEndorserModal(true); }}
                            className="text-left w-auto max-w-xs sm:max-w-sm md:max-w-md px-3 py-1 bg-white border border-[#d8b36b] rounded-md text-[#2d1208] truncate"
                            title={request.endorser_message}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>
                        </button>
                       ) : (
                        <span className="text-gray-500">-</span>
                       )}
                    </div>
                </td>
                
                
                <td>
                    <div className="font-bold">
                       {request.status === 'for-pickup' ? (
                        <button onClick={() => window.open(`/requests/${request.id}/pdf`, '_blank')} className="text-blue-500 hover:text-blue-700 underline font-semibold" type="button">View Issuance</button>
                       ) : request.status === 'pending' ? (
                        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition" onClick={() => {setCancelModal(true); setData({request_id: request.id})}}> Cancel </button> 
                       ) : request.status === 'on-hold' ? (
                        <div className="flex items-center gap-2">
                            <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition" onClick={() => {setAttachModal(true); setSelectedAttachRequest(request); setData('request_id', request.id); setData('clearance', [])}}>
                                {Array.isArray(request.clearance) && request.clearance.length > 0 ? 'Update Files' : 'Attach File'}
                            </button>
                            {Array.isArray(request.clearance) && request.clearance.length > 0 ? (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Uploaded ({request.clearance.length})</span>
                            ) : (
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">Not Uploaded</span>
                            )}
                        </div>
                       ) : null}
                    </div>
                </td>
                
                
                </tr>
             ))} 
            </tbody>
            </table>
            </div>


            {/* Create Request */}
            {requestItem && (
                <dialog className="modal modal-open">
                <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70 max-w-2xl">
                    <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setrequestItemModal(false)}
                    >
                    ✕
                    </button>

                    <form onSubmit={request_item} className="flex flex-col gap-4">
                        <h3 className="font-bold text-2xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent mb-2">Create Request</h3>

                        <div className="flex flex-col gap-4">
                            {data.item.map((item, index) => (
                                <div key={index} className="flex flex-row gap-4">
                                    <label className="input validator flex-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                                        </svg>
                                        <input value={item} onChange={(e) => {
                                            const newItems = [...data.item];
                                            newItems[index] = e.target.value;
                                            setData('item', newItems);
                                        }} type="text" required placeholder="Item" title="Input Request Here" />
                                    </label>

                                    <label className="input validator flex-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                                        </svg>
                                        <input value={data.quantity[index]} onChange={(e) => {
                                            const newQuantities = [...data.quantity];
                                            newQuantities[index] = e.target.value;
                                            setData('quantity', newQuantities);
                                        }} min={0} type="number" required placeholder="Quantity" title="Input Quantity of Request Here" />
                                        {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                            const newItems = [...data.item];
                                            const newQuantities = [...data.quantity];

                                            newItems.splice(index, 1);
                                            newQuantities.splice(index, 1);

                                            setData('item', newItems);
                                            setData('quantity', newQuantities);
                                            }}
                                        >
                                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        )}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <label className="input validator">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>
                            <input value={data.message} onChange={(e) => setData('message', e.target.value)} type="text" placeholder="Message(optional)" title="Input Message Here"/>
                            </label>
                        </div>
                    
                    {/* Create Item Button */}
                        <button type="button" onClick={() => {
                            setData('item', [...data.item, '']);
                            setData('quantity', [...data.quantity, '']);
                        }} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition">+ Add Item</button>
                        <button type="submit" className="bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] hover:from-[#6b0d0d] hover:via-[#8b1515] hover:to-[#9c7f0c] text-white font-semibold py-2 px-6 rounded-lg transition">Send Request</button>
                    </form>
                
                </div>
                </dialog>
            )}


            {/* Cancel Request */}
            {cancelModal && (
                <dialog className="modal modal-open">
                <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70">
                    <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setCancelModal(false)}
                    >
                    ✕
                    </button>

                    <form onSubmit={cancel_request} className="flex flex-col gap-4">
                        <h3 className="font-bold text-2xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent mb-4">Cancel Request</h3>
                        <p className="text-gray-700 mb-4">Are you sure you want to cancel this request? This action cannot be undone.</p>
                                <div className="flex flex-row gap-4 justify-center">
                                    <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition">Yes, Cancel</button>
                                    <button type="button" onClick={() => setCancelModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition">No, Keep</button>
                                </div>
                    </form>
                
                </div>
                </dialog>
            )}


            {/* Attach file Request */}
            {attachModal && (
                <dialog className="modal modal-open">
                <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70">
                    <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setAttachModal(false)}
                    >
                    ✕
                    </button>

                    <form onSubmit={attach_file} className="flex flex-col gap-4">
                        <h3 className="font-bold text-2xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent mb-2">Upload Clearance</h3>
                        <p className="text-gray-700 mb-2">Attach clearance images for this request.</p>
                        <div className="text-sm">
                            {Array.isArray(selectedAttachRequest?.clearance) && selectedAttachRequest.clearance.length > 0 ? (
                                <span className="text-green-600 font-semibold">Current status: Uploaded ({selectedAttachRequest.clearance.length} image/s)</span>
                            ) : (
                                <span className="text-orange-600 font-semibold">Current status: Not uploaded</span>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setData('clearance', Array.from(e.target.files || []))}
                            className="file-input file-input-bordered w-full border-[#d8b36b] bg-white text-[#2d1208]"
                            required
                        />

                        {Array.isArray(data.clearance) && data.clearance.length > 0 && (
                            <div className="rounded border p-3">
                                <p className="font-semibold mb-2 text-[#2d1208]">Selected files ({data.clearance.length})</p>
                                <ul className="text-sm list-disc list-inside">
                                    {data.clearance.map((file, index) => (
                                        <li key={index} className="text-[#2d1208]">{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <p className="text-xs opacity-70">
                            Upload status: {processing ? 'Uploading...' : 'Ready'}
                        </p>

                                <div className="flex flex-row gap-10 justify-center">
                                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50" disabled={processing}>
                                        {processing ? 'Uploading...' : 'Upload'}
                                    </button>
                                    <button type="button" onClick={() => {setAttachModal(false); setSelectedAttachRequest(null)}} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50" disabled={processing}>Cancel</button>
                                </div>
                    </form>
                
                </div>
                </dialog>
            )}

            {/* Endorser Message Modal */}
            {endorserModal && (
                <dialog className="modal modal-open">
                <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70 max-w-2xl">
                    <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setEndorserModal(false)}
                    >
                    ✕
                    </button>

                    <h3 className="font-bold text-2xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent mb-4">Endorser Message</h3>

                    <div className="text-[#2d1208] whitespace-pre-wrap break-words p-2 border border-transparent rounded">
                        {endorserMessage}
                    </div>

                    <div className="flex justify-center mt-4">
                        <button type="button" onClick={() => setEndorserModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition">Close</button>
                    </div>
                </div>
                </dialog>
            )}

        </div>
        </SidebarLayout>
    )
}