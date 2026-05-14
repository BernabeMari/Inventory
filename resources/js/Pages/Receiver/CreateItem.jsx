import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { PlusIcon, PencilSquareIcon, TrashIcon  } from "@heroicons/react/24/solid";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import React from 'react';

export default function(){
    const [search, setSearch] = useState('')
    const [resetModal, setResetModal] = useState(false)
    const [createItemModal, setcreateItemModal] = useState(false)
    const [editItemModal, seteditItemModal] = useState(null)
    const [addReceiptModal, setaddReceiptModal] = useState(null)
    const {unitofmeasure, items, flash, quantities, issuances, history} = usePage().props
    const {post, data, setData, reset} = useForm({
        unit_of_measure: '',
        description: '',
        total: '',
        quantity: '',
    })

    const [unitOptions, setUnitOptions] = useState(
        unitofmeasure.map(item => ({
            value: item.id,
            label: item.unit_of_measure
        }))
    )
        
    function createItem(e){
        e.preventDefault()
        post(route('create_item'),{
            onSuccess: ()=> {setcreateItemModal(false); reset()}
        })
    }

    function addReceipt(e){
        e.preventDefault()
        post(route('add_receipt'),{
            onSuccess: () => {setaddReceiptModal(false); reset()}
        })
    }

    function editReceipt(e){
        e.preventDefault()
        post(route('edit_receipt'),{
            onSuccess: () => {seteditItemModal(false); reset()}
        })
    }

    function handleSearch(e){
        setSearch(e.target.value)
        router.get(route('receiver_page'), {search: e.target.value})
    }

    function resetInventory(e){
        e.preventDefault()  
        post(route('reset_inventory'), {less: 0, add_receipts: [], onSuccess: () => setResetModal(false)})
    }

    return(
    <SidebarLayout>
    <div className="flex-col flex overflow-auto relative">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#b91c1c]">Receiver</p>
        <h3 className="font-bold text-3xl m-4 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent">Create Item</h3>
        {flash.success && (
            <div className="alert bg-green-100 border-2 border-green-400 text-green-800 mb-4 rounded-lg">
                {flash.success}
            </div>
        )}
        {flash.error && (
            <div className="alert bg-red-100 border-2 border-red-400 text-red-800 mb-4 rounded-lg">
                {flash.error}
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
                <div className="m-6">
                    <button onClick={(e) => setcreateItemModal(true)} className="bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] hover:shadow-lg text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition"><PlusIcon className="w-5 h-5" />Create Item</button>
                </div>
              </div>

              {/* reset button */}
                <div className="absolute top-0 right-0">
                    <button onClick={(e) => {setResetModal(true); setData({id: data.id})}} className="btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    </button>
                </div>
                

                {/* reset Modal */}
            {resetModal && (
                <dialog className="modal modal-open">
                <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70">
                    <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setResetModal(false)}
                    >
                    ✕
                    </button>

                    <form onSubmit={resetInventory} className="flex flex-col gap-4">
                        <p>Are you sure you want to <span className="inline-block px-3 py-1 bg-[#ffd700]/30 border border-[#d4a017] text-[#5a3a1a] rounded font-bold">RESET</span> this month with:</p>                 
                        <div className="flex justify-center items-center">
                        <div className="overflow-x-auto w-full max-h-[400px] overflow-y-auto">
                            
                            <table className="w-full border-collapse border border-[#d8b36b]">
                            
                            <thead className="sticky top-0 bg-gradient-to-r from-[#7f1717] via-[#a91f1f] to-[#c99a1b] z-10">
                                <tr>
                                <th className="border border-[#d8b36b] text-white p-2">ITEM NO.</th>
                                <th className="border border-[#d8b36b] text-white p-2">DESCRIPTION</th>
                                <th className="border border-[#d8b36b] text-white p-2">UNIT</th>
                                <th className="border border-[#d8b36b] text-white p-2">BEGINNING</th>
                                <th className="border border-[#d8b36b] text-white p-2">TOTAL</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.data.map(item => {
                                    const lastHistory = item.history[item.history.length - 1];
                                    return (
                                        <tr key={item.id} className="hover:bg-[#fff7ea]">
                                            <td className="border border-[#d8b36b] p-2">{item.id}</td>
                                            <td className="border border-[#d8b36b] p-2">{item.description}</td>
                                            <td className="border border-[#d8b36b] p-2">{item.unit_of_measure}</td>
                                            <td className="border border-[#d8b36b] p-2">{lastHistory?.ending_balance}</td>
                                            <td className="border border-[#d8b36b] p-2 font-bold text-[#8b1c1c]">{item.computed_total}</td>
                                        </tr>
                                    );
                                })}

                            </tbody>

                            </table>

                        </div>
                        </div>

                                <div className="flex flex-row gap-10 justify-center">
                                    <button type="submit" className="bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-2 px-6 rounded-lg transition">Yes</button>
                                    <button onClick={() => setResetModal(false)} className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-2 px-6 rounded-lg transition">No</button>
                                </div>
                    </form>
                
                </div>
                </dialog>
            )}


        {/* Table */}
        <div className="flex justify-center items-center p-4">
            <table className="w-full border-collapse border border-[#d8b36b]">
            {/* head */}
            <thead className="bg-gradient-to-r from-[#7f1717] via-[#a91f1f] to-[#c99a1b]">
                <tr>
                <th className="border border-[#d8b36b] text-white p-3 font-semibold">ITEM NO.</th>
                <th className="border border-[#d8b36b] text-white p-3 font-semibold">DESCRIPTION</th>
                <th className="border border-[#d8b36b] text-white p-3 font-semibold">UNIT OF MEASURE</th>
                <th className="border border-[#d8b36b] text-white p-3 font-semibold">ADD:RECEIPTS</th>
                <th className="border border-[#d8b36b] text-white p-3 font-semibold">TOTAL</th>
                <th className="border border-[#d8b36b] text-white p-3 font-semibold">LESS: ISSUANCE</th>
                <th className="border border-[#d8b36b] text-white p-3 font-semibold">ENDING BALANCE</th>
                </tr>
            </thead>
            <tbody>
                {items.data.map(item => (
                <tr className="hover:bg-[#fff7ea]"> 


                <td className="border border-[#d8b36b] p-2">
                    <div className="font-bold">
                        {item.id}
                    </div>
                </td>


                <td className="border border-[#d8b36b] p-2">
                    <div className="font-bold">
                        {item.description}
                    </div>
                </td>


                <td className="border border-[#d8b36b] p-2">
                    <div className="font-bold">
                        {item.unit_of_measure}
                    </div>
                </td>
                
                <td className="border border-[#d8b36b] p-2">
                     <div className="flex justify-between items-center gap-2">
                        {item.added_receipt?.join(' + ')}
                        
                        {addReceiptModal === item.id && (<div>
                            <form onSubmit={addReceipt}>
                                <input value={data.quantity} min="1" onChange={(e) => setData('quantity', e.target.value)} placeholder="Add Receipt" type="number" required className="px-3 py-2 border border-[#d8b36b] rounded bg-white text-[#2d1208]"/>
                                <button type="submit" className="ml-2 bg-[#16a34a] hover:bg-[#15803d] text-white py-2 px-3 rounded text-sm font-semibold transition">Save</button>
                            </form>
                        </div>)}
                        
                        <div className="flex gap-1">
                            <button onClick={() => {setaddReceiptModal(item.id); setData({item_id: item.id})}} className="bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] hover:shadow-md text-white p-2 rounded transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></button>
                            <button onClick={() => {seteditItemModal(item.id); setData({item_id: item.id, quantity: Array.isArray(item.added_receipt) ? item.added_receipt : []})}} className="bg-[#8b5a2b] hover:bg-[#6b4423] text-white p-2 rounded transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg></button>
                        </div>

                        {/* Edit Receipt Modal */}
                        {editItemModal === item.id && (
                                <dialog className="modal modal-open">
                                    <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70">
                                        <h3 className="font-bold text-xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent m-4">Edit Receipt</h3>
                                        <button
                                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                            onClick={() => seteditItemModal(false)}
                                        >
                                            ✕
                                        </button>

                                        <form onSubmit={editReceipt} className="flex flex-col gap-4">
                                            {Array.isArray(data.quantity) && data.quantity.map((qty, index) => (
                                            <div key={index} className="flex items-center justify-center gap-2 mb-4">
                                                <input
                                                type="number"
                                                min="0"
                                                required
                                                value={qty}
                                                onChange={(e) => {
                                                    const newQuantity = [...data.quantity];
                                                    newQuantity[index] = e.target.value;
                                                    setData('quantity', newQuantity);
                                                }}
                                                className="px-3 py-2 border border-[#d8b36b] rounded bg-white text-[#2d1208] flex-1"
                                                />
                                            </div>
                                            ))}
                                            {(!Array.isArray(data.quantity) || !data.quantity.length) && (
                                                <p className="text-sm text-gray-500">No added receipts yet.</p>
                                            )}
                                            <button type="submit" className="bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] hover:shadow-lg text-white font-semibold py-2 rounded-lg transition">Save Edit</button>
                                        </form>
                                     </div>
                                </dialog>
                            )}

                    </div>
                </td>

                <td className="border border-[#d8b36b] p-2">
                    <div className="font-bold">
                       {item.total}
                    </div>
                </td>
                
                
                <td className="border border-[#d8b36b] p-2">
                    <div className="font-bold">
                       {item.less}
                    </div>
                </td>
                
                <td className="border border-[#d8b36b] p-2">
                    <div className="font-bold text-[#8b1c1c]">
                       {item.computed_total}
                    </div>
                </td>

                </tr>
                ))}
            </tbody>
            </table>
        </div>

    {/* Create Item */}
      {createItemModal && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-[#fffdf8] border-2 border-[#e4c57c]/70">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setcreateItemModal(false)}
            >
              ✕
            </button>

            <form onSubmit={createItem} className="flex flex-col gap-4">
                <h3 className="font-bold text-xl bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent m-4">Create Item</h3>

                <div className="flex flex-row gap-4">
                    <div className="flex-1">
                    <label className="block text-sm font-semibold text-[#4a2814] mb-2">Item Description</label>
                    <input value={data.description} onChange={(e) => setData('description', e.target.value)} type="text" required placeholder="Item" title="Create Items Here" className="w-full px-3 py-2 border border-[#d8b36b] rounded bg-white text-[#2d1208]"/>
                    </div> 
                
                
                    <div className="flex-1">
                    <label className="block text-sm font-semibold text-[#4a2814] mb-2">Quantity</label>
                    <input value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} min={0} type="number" required placeholder="Quantity" title="Input Quantity of Item Here" className="w-full px-3 py-2 border border-[#d8b36b] rounded bg-white text-[#2d1208]"/>
                    </div> 
                </div>

                <div className="w-full">
                    <label className="block text-sm font-semibold text-[#4a2814] mb-2">Unit of Measure</label>
                    <CreatableSelect className="w-full"
                        maxMenuHeight={200}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        value={unitOptions.find(u => u.label === data.unit_of_measure) || null}
                        onChange={(selected) => setData('unit_of_measure', selected ? selected.label : '')}
                        onCreateOption={(inputValue) => {
                            const newOption = { value: inputValue, label: inputValue };
                            setUnitOptions(prev => [...prev, newOption]);
                            setData('unit_of_measure', inputValue);
                        }}
                        required
                        options={unitOptions}
                        isSearchable
                    />        
                </div>
               
               {/* Create Item Button */}
                <button className="bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] hover:shadow-lg text-white font-semibold py-2 rounded-lg transition w-full">Create Item</button>
            </form>
          
          </div>
        </dialog>
      )}

                <div>
                    {items?.links?.length > 3 && (
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full">
                            {items.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url || "#"}
                                    preserveScroll
                                    className={`px-3 py-1 rounded-md text-sm border transition ${
                                        link.active
                                            ? "bg-[#8b1c1c] text-white border-[#8b1c1c]"
                                            : link.url
                                            ? "bg-white text-[#2d1208] border-[#d8b36b] hover:bg-[#fff7ea]"
                                            : "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none"
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>


    </div>
    </SidebarLayout>
    )
}