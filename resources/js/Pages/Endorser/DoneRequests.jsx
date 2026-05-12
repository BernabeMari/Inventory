import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function(){
    const [search, setSearch] = useState('')
    const {requests} = usePage().props
    const [endorserModal, setEndorserModal] = useState(false)
    const [endorserMessage, setEndorserMessage] = useState('')

    function handleSearch(e){
        setSearch(e.target.value)
        router.get(route('endorser_done_request_page'), {search: e.target.value})
    }
    return(
        <SidebarLayout>
            <div className="flex-col flex overflow-auto">
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#b91c1c]">Endorser</p>
                <h3 className="font-bold text-3xl m-4 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent">Done Requests</h3>
                {/* Search button */}
            <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                    <SearchField value={search} onChange={handleSearch} placeholder="Search requests..."/>
                    <p className="mt-4">
                    You searched: {search}
                    </p> 
                </div>

                <div className="gap-5 flex">
                    <button value={''} onClick={handleSearch} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700">All</button>
                    <button value={'for-pickup'} onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">For Pickup</button>
                    <button value={'rejected'} onClick={handleSearch} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Rejected</button>
                    <button value={'cancelled'} onClick={handleSearch} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">Cancelled</button>
                </div>
            </div>
                

                {/* Table */}
                <div className="flex justify-center items-center p-4 overflow-x-auto">

                    <table className="w-full border-collapse border border-[#d8b36b]">
                    {/* head */}
                    <thead className="bg-gradient-to-r from-[#7f1717] via-[#a91f1f] to-[#c99a1b] text-white">
                        <tr>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold"></th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">DEPARTMENT</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">REQUEST</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">QUANTITY OF REQUEST</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">ISSUED ITEM</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">ISSUED QUANTITY</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">UNFULFILLED QUANTITY</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">STATUS</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">MESSAGE</th>
                        <th className="border border-[#d8b36b] text-white p-3 font-semibold">ENDORSER'S MESSAGE</th>
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

                        <td className="border border-[#d8b36b] p-2">
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
                            <div className="font-bold">
                                {request.issuances?.map(issuance => issuance.issued_item).join(', ')}
                            </div>
                        </td>

                        <td className="border border-[#d8b36b] p-2">
                            <div className="font-bold">
                                {request.issuances?.map(issuance => issuance.fulfilled_quantity).join(', ')}
                            </div>
                        </td>

                        <td className="border border-[#d8b36b] p-2">
                            <div className="font-bold">
                                {request.issuances?.map(issuance => issuance.unfulfilled_quantity).join(', ')}
                            </div>
                        </td>

                        <td className="border border-[#d8b36b] p-2 w-auto whitespace-nowrap">
                            <div className="font-bold">
                                {request.status === 'approved' && (
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Approved</span>
                                )}

                                {request.status === 'rejected' && (
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Rejected</span>
                                )}

                                {request.status === 'cancelled' && (
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">Cancelled</span>
                                )}

                                {request.status === 'for-pickup' && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">For pick up</span>
                                )}
                            </div>
                        </td>

                        <td className="border border-[#d8b36b] p-2">
                            <div className="font-bold">
                                {request.message}
                            </div>
                        </td>

                        <td className="border border-[#d8b36b] p-2 flex justify-center">
                            <div className="font-bold">
                                {request.endorser_message ? (
                                    <button type="button" className="text-left w-auto px-3 py-1 bg-white border border-[#d8b36b] rounded-md text-[#2d1208] truncate" title={request.endorser_message} onClick={() => { setEndorserMessage(request.endorser_message); setEndorserModal(true); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>
                                    </button>
                                ) : (
                                    <span className="text-gray-500">-</span>
                                )}
                            </div>
                        </td>
                        </tr>
                            ))}
                        </tbody>
                        </table>                         
           
                    </div>    

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