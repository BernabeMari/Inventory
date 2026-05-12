import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import Select from 'react-select';

export default function(){
    const [approveModal, setapproveModal] = useState(false)
    const [holdModal, setholdModal] = useState(false)
    const [rejectModal, setrejectModal] = useState(false)
    const [pickupModal, setpickupModal] = useState(false)
    const [clearanceModal, setClearanceModal] = useState(false)
    const [clearanceImages, setClearanceImages] = useState([])
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

    function pickup(e){
        e.preventDefault()
        post(route('action_pickup'), {
            onSuccess: () => setpickupModal(false)
        })
    }

    function hold(e){
        e.preventDefault()
        post(route('action_hold'), {
            onSuccess: () => setholdModal(false)
        })
    }

    function handleSearch(e){
        setSearch(e.target.value)
        router.get(route('endorser_page'), {search: e.target.value})
    }

    const itemOptions = items.map(item => ({
        value: item.id,
        label: `${item.description} - (${item.available_stock ?? 0})`,
    }))

    return(
    <SidebarLayout>
         <div className="flex-col flex overflow-auto">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#b91c1c]">Endorser</p>
            <h3 className="font-bold text-3xl m-4 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent">Requests</h3>
        {flash.error && (<div className="bg-red-100 border-2 border-red-400 text-red-800 mb-4 rounded-lg p-4">
        {flash.error}
        </div>
        )}
            {/* Search button */}
            <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                    <SearchField value={search} onChange={handleSearch} placeholder="Search requests..."/>
                    <p className="mt-4">
                    You searched: {search}
                    </p> 
                </div>

                <div className="gap-5 flex">
                    <button value={''} onClick={handleSearch} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                        All
                    </button>
                    <button value={'pending'} onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                        Pending
                    </button>
                    <button value={'approved'} onClick={handleSearch} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                        Approved
                    </button>
                    <button value={'on-hold'} onClick={handleSearch} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                        On-Hold
                    </button>
                </div>
            </div>       
        
                {/* Table */}
                <div className="flex justify-center items-center p-4 overflow-x-auto">
                    <table className="w-full border-collapse border border-[#d8b36b]">
                    {/* head */}
                    <thead className="bg-gradient-to-r from-[#7f1717] via-[#a91f1f] to-[#c99a1b]">
                        <tr>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold"></th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">DEPARTMENT</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">REQUEST</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">QUANTITY</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">STATUS</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">PURPOSE</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(request => (
                            <tr className="hover:bg-[#fff7ea]"> 
        
        
                        <td className="border border-[#d8b36b] p-2">
                            <div className="font-bold flex justify-center items-center">
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
                            <div className="font-bold flex-row flex justify-center items-center gap-2">
                                {request.user?.department}
                            </div>
                        </td>
        
        
                        <td className="border border-[#d8b36b] p-2">
                            <div className="font-bold">
                                {request.item.join(', ')}
                            </div>
                        </td>
        
        
                        <td className="border border-[#d8b36b] p-2">
                            <div className="font-bold">
                               {request.quantity.join(', ')}
                            </div>
                        </td>
                        
                        
                        <td className="border border-[#d8b36b] p-2">
                            <div className="font-bold flex-row flex justify-center gap-2">
                               {request.status === 'pending' ? (
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">{request.status}</span>
                                ) : request.status === 'approved' ? (
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">{request.status}</span>
                                ) : (
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">{request.status}</span>
                                )}
                            </div>
                        </td>
                       
                       
                        <td className="border border-[#d8b36b] p-2">
                            <div className="font-bold">
                               {request.message}
                            </div>
                        </td>
                       
                       {/* action buttons */}
                        <td className="border border-[#d8b36b] p-2 flex-row flex gap-2 justify-center items-center">
                            {request.status != 'approved' && (
                                <div className="font-bold flex-row flex gap-1">
                                <div className="tooltip tooltip-close tooltip-right">
                                    <button onClick={(e) => {setapproveModal(true); setData({issuance_id: request.issuances?.id || null, request_id: request.id, quantity: request.quantity, item: request.item, item_id: Array(request.item.length).fill(''), fulfilled_quantity: request.fulfilled_quantity || [], unfulfilled_quantity: request.unfulfilled_quantity || []})}} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    </button>
                                </div>
                                
                                {request.status === 'on-hold' && (
                                    <div className="tooltip tooltip-close tooltip-right">
                                        {Array.isArray(request.clearance) && request.clearance.length > 0 && (
                                <button type="button"className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded transition"
                                    onClick={() => {
                                        setClearanceImages(request.clearance)
                                        setClearanceModal(true)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                    </svg>
                                </button>
                            )}
                            </div>
                                )}
                            
                                {request.status === 'pending' && (
                                    <div className="tooltip tooltip-close tooltip-right">
                                        <button onClick={(e) => {setholdModal(true); setData({issuance_id: request.issuances?.id || null, request_id: request.id, quantity: request.quantity, item: request.item, item_id: Array(request.item.length).fill(''), fulfilled_quantity: request.fulfilled_quantity || [], unfulfilled_quantity: request.unfulfilled_quantity || []})}} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        </button>
                                    </div>
                                )}

                                <div className="tooltip tooltip-close tooltip-right">
                                    <button onClick={(e) => {setrejectModal(true); setData({request_id: request.id})}} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    </button>
                                </div>
                            </div>
                            )}
                            

                            {request.status === 'approved' && (
                                <div className="font-bold flex-row flex">
                                    <div className="tooltip tooltip-close tooltip-right">
                                        <button onClick={(e) => {setpickupModal(true); setData({issuance_id: request.issuances?.id || null, request_id: request.id, quantity: request.quantity, item: request.item, item_id: Array(request.item.length).fill(''), fulfilled_quantity: request.fulfilled_quantity || [], unfulfilled_quantity: request.unfulfilled_quantity || []})}} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                        </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                        </td>
        
                        </tr>
                     ))}
                    </tbody>
                    </table>
                     
                {/* Approve Modal */}
                     {approveModal && (
                        <dialog className="modal modal-open">
                        <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70 max-w-2xl">
                            <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setapproveModal(false)}
                            >
                            ✕
                            </button>

                            <form onSubmit={approve} className="flex flex-col gap-4">
                                <h3 className="font-bold text-2xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent mb-2">Approve Request</h3>
                                <div className="bg-[#fff7ea] border-l-4 border-[#d4a017] p-3 rounded text-sm">
                                {data.item.map((item, index) => (
                                    <div key={index} className="text-gray-700 font-medium">
                                        <strong>{item}</strong> - Qty: {data.quantity[index]}
                                    </div>
                                ))}
                                </div>

                                {data.item.map((row, index) => (
                                    <div key={index} className="flex flex-row gap-4 items-center">
                                        <div className="w-64">
                                            <Select
                                                options={itemOptions}
                                                value={itemOptions.find(o => o.value === (data.item_id[index] || '')) || null}
                                                onChange={(selected) => {
                                                    const itemIds = [...(data.item_id || [])];
                                                    itemIds[index] = selected ? selected.value : '';
                                                    setData('item_id', itemIds);
                                                }}
                                                placeholder="Item"
                                                isSearchable
                                            />
                                        </div>

                                    <label className="input validator w-28">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                                    </svg>
                                    <input className="input input-sm w-20" value={data.fulfilled_quantity[index] ?? ''} onChange={(e) => {const newFulfilled = [...(data.fulfilled_quantity || [])]; newFulfilled[index] = e.target.value; setData('fulfilled_quantity', newFulfilled);}} type="number" min={0} required placeholder="Quantity" title="Put Issue Quantity Here"/>
                                    </label>  
                                    
                                    
                                    <label className="input validator">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                    <input className="input input-sm w-20" type="number" value={data.unfulfilled_quantity[index] ?? ''} onChange={(e) => {const newUnfulfilled = [...(data.unfulfilled_quantity || [])]; newUnfulfilled[index] = e.target.value; setData('unfulfilled_quantity', newUnfulfilled);}} min={0} required placeholder="Unfulfilled" title="Put Unfulfilled Quantity Here"/>
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

                                <div className="flex flex-row gap-4 mt-5 justify-center">
                                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition">Approve</button>
                                <button onClick={() => setapproveModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition">Cancel</button>
                                </div>
                            </form>


                        </div>
                        </dialog>
                    )}

                    {/* Hold Modal */}
                     {holdModal && (
                        <dialog className="modal modal-open">
                        <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70">
                            <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setholdModal(false)}
                            >
                            ✕
                            </button>
                            <h3 className="font-bold text-2xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent mb-4">Put Request on Hold</h3>
                            <p className="text-gray-700 mb-4">Enter the reason for putting this request on hold:</p>
                            <form onSubmit={hold} className="flex flex-col gap-4">
                                <textarea value={data.endorser_message} onChange={(e) => setData('endorser_message', e.target.value)} required placeholder="Reason for putting on hold" title="Enter reason for putting on hold" className="w-full px-3 py-2 border border-[#d8b36b] rounded bg-white text-[#2d1208] rows-3" />
                                <div className="flex flex-row gap-4 justify-center">
                                    <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition">Set Hold</button>
                                    <button type="button" onClick={() => setholdModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition">Cancel</button>
                                </div>
                            </form>
                        </div>
                        </dialog>
                    )}
                   
                   
                    {/* Pickup Modal */}
                     {pickupModal && (
                        <dialog className="modal modal-open">
                        <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70">
                            <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setpickupModal(false)}
                            >
                            ✕
                            </button>
                            <h3 className="font-bold text-2xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent mb-4">Set For Pickup</h3>
                            <p className="text-gray-700 mb-4">Are you ready to set this approved request for pickup?</p>
                            <form onSubmit={pickup} className="flex flex-col gap-4">
                                <div className="flex flex-row gap-4 justify-center">
                                    <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition">Set For Pickup</button>
                                    <button type="button" onClick={() => setpickupModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition">Cancel</button>
                                </div>
                            </form>
                        </div>
                        </dialog>
                    )}
                
                
                {/* Reject Modal */}
                     {rejectModal && (
                        <dialog className="modal modal-open">
                        <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70">
                            <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setrejectModal(false)}
                            >
                            ✕
                            </button>
                            <h3 className="font-bold text-2xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent mb-4">Reject Request</h3>
                            <p className="text-gray-700 mb-4">Please enter the reason for rejecting this request:</p>
                            <form onSubmit={reject} className="flex flex-col gap-4">
                                <textarea value={data.endorser_message} onChange={(e) => setData('endorser_message', e.target.value)} required placeholder="Rejection reason" title="Enter reason for rejection" className="w-full px-3 py-2 border border-[#d8b36b] rounded bg-white text-[#2d1208] rows-3" />
                                <div className="flex flex-row gap-4 justify-center">
                                    <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition">Reject Request</button>
                                    <button type="button" onClick={() => setrejectModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition">Cancel</button>
                                </div>
                            </form>
                        </div>
                        </dialog>
                    )}

                {/* Clearance Images Modal */}
                {clearanceModal && (
                    <dialog className="modal modal-open">
                        <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70 max-w-4xl">
                            <button
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                onClick={() => {
                                    setClearanceModal(false)
                                    setClearanceImages([])
                                }}
                            >
                                ✕
                            </button>

                            <h3 className="font-bold text-2xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent mb-4">Department Clearance Images</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {clearanceImages.map((imagePath, index) => (
                                    <a
                                        key={index}
                                        href={`/storage/${imagePath}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="border rounded p-2 block"
                                    >
                                        <img
                                            src={`/storage/${imagePath}`}
                                            alt={`clearance-${index + 1}`}
                                            className="w-full h-56 object-cover rounded"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </dialog>
                )}

                </div>
            </div>
    </SidebarLayout>
    )
}