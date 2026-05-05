import SearchField from "@/Components/SearchField"
import SidebarLayout from "@/Layouts/SidebarLayout"
import { PlusIcon } from "@heroicons/react/24/solid"
import { router, useForm, usePage } from "@inertiajs/react"
import { useState } from "react"

export default function({requests}){
    const [requestItem, setrequestItemModal] = useState(false)
    const [cancelModal, setCancelModal] = useState(false)
    const [search, setSearch] = useState('')
    const {auth, flash} = usePage().props
    const {post, data, setData, reset} = useForm({
        item: [''],
        quantity: [''],
        status: '',
        message: '',
        user_id: '',
        pending: ''
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

    function handleSearch(e){
        setSearch(e.target.value)
        router.get(route('department_page'), {search: e.target.value})
    }
    
    return(
        <SidebarLayout>
        <div className="flex-col flex overflow-auto relative">
        <h3 className="font-bold text-lg m-4">Create Request</h3>
        {flash.success && (
            <div className="alert alert-success mb-4">
                {flash.success}
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

            {/* Add Item Button */}
            <div className="bg-white absolute top-0 right-0 m-6 rounded-full border border-black ">
                <button onClick={(e) => {setrequestItemModal(true);setData({user_id: data.id, item: [''], quantity: ['']})}} className="btn btn-soft btn-secondary rounded-full p-4"><PlusIcon className="w-5 h-5" />Create Request</button>
            </div>

            <div className="gap-5 flex">
                <button value="pending" onClick={(e) => setData('status', e.target.value)} className="btn bg-yellow-500 p-2 text-white hover:bg-yellow-600">
                    Pending
                </button>
                <button className="btn bg-green-500 p-2 text-white hover:bg-green-600">
                    Approved
                </button>
                <button className="btn bg-red-500 p-2 text-white hover:bg-red-600">
                    Rejected
                </button>
                <button className="btn bg-gray-500 p-2 text-white hover:bg-gray-600">
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
                
                
                <td>
                    <div className="font-bold">
                       {request.status === 'approved' ? (
                        <button onClick={() => window.open(`/requests/${request.id}/pdf`, '_blank')} className="underline" type="button">View Issuance</button>
                       ) : request.status === 'pending' ? (
                        <button className="btn btn-sm btn-circle btn-ghost" onClick={() => {setCancelModal(true); setData({request_id: request.id})}}> ✕ </button> 
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
                <div className="modal-box">
                    <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setrequestItemModal(false)}
                    >
                    ✕
                    </button>

                    <form onSubmit={request_item} className="flex flex-col gap-4">
                        <h3 className="font-bold text-lg m-4">Create Request</h3>

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
                        }}>+</button>
                        <button className="btn btn-primary">Send Request</button>
                    </form>
                
                </div>
                </dialog>
            )}


            {/* Cancel Request */}
            {cancelModal && (
                <dialog className="modal modal-open">
                <div className="modal-box">
                    <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setCancelModal(false)}
                    >
                    ✕
                    </button>

                    <form onSubmit={cancel_request} className="flex flex-col gap-4">
                        <p>Are you sure you want to <p className="badge badge-ghost bold badge-xl">CANCEL</p> this request?</p>                 
                                <div className="flex flex-row gap-10 justify-center">
                                    <button type="submit" className="btn btn-success w-10">Yes</button>
                                    <button onClick={() => setCancelModal(false)} className="btn btn-error w-10">No</button>
                                </div>
                    </form>
                
                </div>
                </dialog>
            )}

        </div>
        </SidebarLayout>
    )
}