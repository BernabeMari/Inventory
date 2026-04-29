import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { PlusIcon, PencilSquareIcon, TrashIcon  } from "@heroicons/react/24/solid";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";

export default function(){
    const [search, setSearch] = useState('')
    const [createItemModal, setcreateItemModal] = useState(false)
    const [addReceiptModal, setaddReceiptModal] = useState(null)
    const {unitofmeasure, items, total, requests, flash} = usePage().props
    const {post, data, setData, reset} = useForm({
        unit_of_measure: '',
        description: '',
        total: '',
        quantity: [''],
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


    return(
    <SidebarLayout>
    <div className="flex-col flex overflow-auto">
        <h3 className="font-bold text-lg m-4">Create Item</h3>
        {flash.success && (
            <div className="alert alert-success mb-4">
                {flash.success}
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
                <th>ITEM NO.</th>
                <th>DESCRIPTION</th>
                <th>UNIT OF MEASURE</th>
                <th>BEGINNING OF MEASURE</th>
                <th>ADD:RECEIPTS</th>
                <th>TOTAL</th>
                <th>LESS: ISSUANCE</th>
                <th>ENDING BALANCE</th>
                </tr>
            </thead>
            <tbody>
                {items.filter(item => item.description.toLowerCase().includes(search.toLowerCase()) || item.unit_of_measure.toLowerCase().includes(search.toLowerCase())).map(item => (
                <tr> 


                <td>
                    <div className="font-bold">
                        {item.id}
                    </div>
                </td>


                <td>
                    <div className="font-bold">
                        {item.description}
                    </div>
                </td>


                <td>
                    <div className="font-bold">
                        {item.unit_of_measure}
                    </div>
                </td>


                <td>
                    <div className="font-bold">
                       {/* beginning of measure */}
                    </div>
                </td>
                
                
                <td>
                     <div className="flex justify-between items-center">
                        {item.quantity.join(" + ")} 
                        
                        {addReceiptModal === item.id && (<div>
                            <form onSubmit={addReceipt}>
                                <input value={data.quantity} min="1" onChange={(e) => setData('quantity', e.target.value)} placeholder="Add Receipt" type="number" required/>
                                <button type="submit"></button>
                            </form>
                        </div>)}
                        
                        <div><button onClick={() => {setaddReceiptModal(item.id); setData({item_id: item.id})}} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></button></div>
                    </div>
                </td>

                <td>
                    <div className="font-bold">
                       {item.total}
                    </div>
                </td>
                
                
                <td>
                    <div className="font-bold">
                       {item.less}
                    </div>
                </td>

                </tr>
                ))}
            </tbody>
            </table>
        </div>

    {/* Add Item Button */}
      <div className="bg-white m-6 bottom-0 right-0 absolute rounded-full border border-black ">
        <button onClick={(e) => setcreateItemModal(true)} className="btn btn-soft btn-secondary rounded-full p-4"><PlusIcon className="w-5 h-5" /></button>
      </div>

    {/* Create Item */}
      {createItemModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setcreateItemModal(false)}
            >
              ✕
            </button>

            <form onSubmit={createItem} className="flex flex-col gap-4">
                <h3 className="font-bold text-lg m-4">Create Item</h3>

                <div className="flex flex-row gap-4">
                    <label className="input validator">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                    </svg>
                    <input value={data.description} onChange={(e) => setData('description', e.target.value)} type="text" required placeholder="Item" title="Create Items Here"/>
                    </label> 
                
                
                    <label className="input validator">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                    </svg>
                    <input value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} min={0} type="number" required placeholder="Quantity" title="Input Quantity of Item Here"/>
                    </label> 
                </div>

                <div className="flex justify-center">
                    <label className="input validator">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                    </svg>
                    <CreatableSelect className="w-full"
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
                    </label> 
                </div>
               
               {/* Create Item Button */}
                <button className="btn btn-primary">Create Item</button>
            </form>
          
          </div>
        </dialog>
      )}


    </div>
    </SidebarLayout>
    )
}