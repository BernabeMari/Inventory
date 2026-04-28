import SearchField from "@/Components/SearchField"
import SidebarLayout from "@/Layouts/SidebarLayout"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useForm, usePage } from "@inertiajs/react"
import { useState } from "react"

export default function({requests}){
    const [requestItem, setrequestItemModal] = useState(false)
    const [search, setSearch] = useState('')
    const {auth, flash} = usePage().props
    const {post, data, setData, reset} = useForm({
        item: '',
        quantity: '',
        status: '',
        message: '',
        user_id: ''
    })

    function request_item(e){
        e.preventDefault()
        post(route('request_item'),{
            onSuccess: ()=>{reset(); setrequestItemModal(false)}
        })
    }

    return(
        <SidebarLayout>
        <div className="flex-col flex overflow-auto">
        <h3 className="font-bold text-lg m-4">Create Request</h3>
        {flash.success && (
            <div className="alert alert-success mb-4">
                {flash.success}
            </div>
        )}
        {/* Search button */}
        <div className="p-4">
            <SearchField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search requests..."/>
            <p className="mt-4">
            You searched: {search}
            </p> 
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
                <th>VIEW ISSUANCE</th>
                </tr>
            </thead>
            <tbody>
                {requests.filter(request => request.item.toLowerCase().includes(search.toLowerCase()) || request.message && request.message.toLowerCase().includes(search.toLowerCase()) || request.status.toLowerCase().includes(search.toLowerCase())).filter(request => request.user_id === auth.user.id).map(request => (
                <tr> 

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


            {/* Add Item Button */}
            <div className="bg-white m-6 bottom-0 right-0 absolute rounded-full border border-black ">
                <button onClick={(e) => {setrequestItemModal(true);setData({user_id: data.id})}} className="btn btn-soft btn-secondary rounded-full p-4"><PlusIcon className="w-5 h-5" /></button>
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

                        <div className="flex flex-row gap-4">
                            <label className="input validator">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                            </svg>
                            <input value={data.item} onChange={(e) => setData('item', e.target.value)} type="text" required placeholder="Item" title="Input Request Here"/>
                            </label>  
                            
                            
                            <label className="input validator">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                            </svg>
                            <input value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} type="number" min={1} required placeholder="Quantity" title="Input Quantity Here"/>
                            </label>  
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
                        <button className="btn btn-primary">Send Request</button>
                    </form>
                
                </div>
                </dialog>
            )}

        </div>
        </SidebarLayout>
    )
}