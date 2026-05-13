import SearchField from "@/Components/SearchField"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import { PlusIcon, PencilSquareIcon, TrashIcon  } from "@heroicons/react/24/solid";
import SidebarLayout from "@/Layouts/SidebarLayout";
import React from 'react';

export default function({users}){
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [createUserModal, setcreateUserModal] = useState(false)
  const [search, setSearch] = useState("")
  

  const {post, data, setData, reset} = useForm({
    username: '',
    password: '',
    role: '',
    department: '',
    image: '',
    role_department: '',
    username_edit: '',
    is_active: true
  })

  function createUser(e){
    e.preventDefault()
    post(route('create_user'), {
      onSuccess: () => {setcreateUserModal(false); reset()}
    })
  }

  function editUser(e){
    e.preventDefault()
    post(route('edit_user'),{
      onSuccess: () => {setEditModal(false); reset()}
    })
  }

  function deleteUser(e){
    e.preventDefault()
    post(route('delete_user'),{
      onSuccess: ()=> {setDeleteModal(false); reset(); page.reload()}
    })

  }

  function restoreUser(e){
    e.preventDefault()
    post(route('restore_user'),{
      onSuccess: ()=> {setEditModal(false); reset(); page.reload()}
    })
  }

  return(
    <SidebarLayout>
    <div className="min-h-screen bg-[linear-gradient(180deg,_rgba(255,249,241,0.98)_0%,_rgba(255,253,249,1)_100%)] px-4 py-6 text-[#2d1208]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[2rem] border border-[#e4c57c]/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(122,24,24,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#b91c1c]">Administration</p>
              <h3 className="mt-2 text-3xl font-black text-[#2d1208]">Create User</h3>
              <p className="mt-2 max-w-2xl text-sm text-[#6b4b2f]">
                Manage active and inactive user accounts with the same red, gold, and white visual language used across the app.
              </p>
            </div>

            {/* Add User Button */}
            <button
              onClick={(e) => setcreateUserModal(true)}
              className="btn p-2 border-0 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] text-white shadow-lg shadow-[#8b1c1c]/20 hover:from-[#6f1515] hover:via-[#9e1f1f] hover:to-[#b88d11]"
            >
              <PlusIcon className="w-5 h-5" />
              Create User
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="rounded-2xl border border-[#ecd9a8] bg-[#fffaf2] p-4">
              <SearchField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."/>
              <p className="mt-3 text-sm text-[#7a5830]">
                You searched: <span className="font-semibold text-[#2d1208]">{search || 'All users'}</span>
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#ecd9a8] bg-[#fffaf2] px-4 py-3 lg:min-w-[300px]">
              <div>
                {data.is_active ? (
                  <p className="text-sm font-semibold text-[#2d1208]">Showing active users</p>
                ) : (
                  <p className="text-sm font-semibold text-[#2d1208]">Showing inactive users</p>
                )}
              </div>

              {/* Toggle switch active/inactive users */}
              <label className="toggle text-base-content">
                <input type="checkbox" checked={!data.is_active} onChange={(e) => setData('is_active', !e.target.checked)} />
                <svg aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="4" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"></path></g>
                </svg>
                <svg
                  aria-label="disabled"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </label>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[2rem] border border-[#e4c57c]/70 bg-white/90 shadow-[0_20px_60px_rgba(122,24,24,0.08)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="bg-gradient-to-r from-[#7f1717] via-[#a91f1f] to-[#c99a1b] text-white">
                <tr>
                  <th className="text-white">Username</th>
                  <th className="text-white">Role</th>
                  <th className="text-white">Department</th>
                  <th className="text-white">Action</th>
                </tr>
              </thead>
              <tbody>

                {users.filter(user => Boolean(user.is_active) === data.is_active).filter(user => user.username.toLowerCase().includes(search.toLowerCase()) || user.role.toLowerCase().includes(search.toLowerCase()) || user.department && user.department.toLowerCase().includes(search.toLowerCase())).map(user => (
                  <tr className="border-b border-[#f0e0b8] hover:bg-[#fff7ea]">
              
              
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask rounded-full h-10 w-10 flex items-center justify-cente">
                      {user.image ? (
                      <img src={`/storage/${user.image}`} alt={user.username} />
                    ) : (
                      <div className="bg-gradient-to-br from-[#8b1c1c] to-[#d4a017] text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
                        {user.username?.toUpperCase().slice(0, 1)}
                      </div>
                    )}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{user.username}</div>
                  </div>
                </div>
              </td>
              <td>
                {user.role}
              </td>
              <td>{user.department}</td>


              <th className="gap-1 flex">
                <button onClick={(e) => {setEditModal(true);setData({username: user.username, user_id: user.id, username_edit: user.username, is_active: data.is_active })}} className="btn border-0 bg-[#8b1c1c] text-white hover:bg-[#6f1515]"><PencilSquareIcon className="w-5 h-5"/></button>
                {data.is_active && (
                  <button onClick={(e) => {setDeleteModal(true); setData({user_id: user.id, username: user.username, is_active: data.is_active})}} className="btn border-0 bg-[#d4a017] text-[#2d1208] hover:bg-[#b88d11]"><TrashIcon className="w-5 h-5"/></button>
                )}
              </th>
            </tr>
            ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      
      {/* Edit Modal */}
      {editModal && (
        <dialog className="modal modal-open">
          <div className="modal-box border border-[#e4c57c]/70 bg-[#fffdf8] shadow-[0_24px_70px_rgba(78,34,16,0.18)]">
            {data.is_active === false && (
              <button
              className="btn btn-sm btn-circle w-auto p-2 mr-20 border-0 bg-[#d4a017] text-[#2d1208] absolute right-2 top-2 hover:bg-[#b88d11]"
              onClick={restoreUser}
            >
              Restore
            </button>
            )}
            <button
              className="btn btn-sm btn-circle border-0 bg-[#8b1c1c] text-white absolute right-2 top-2 hover:bg-[#6f1515]"
              onClick={() => setEditModal(false)}
            >
              ✕
            </button>
          
            <form onSubmit={editUser} className="flex flex-col justify-center items-center gap-2">

              <h3 className="font-bold text-lg m-4 text-[#2d1208]">Edit User {data.username_edit}</h3>
            
              {/* username Input */}
              <label className="input validator w-full border-[#d8b36b] bg-white text-[#2d1208]">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>

                  <input value={data.username} onChange={(e) => setData('username', e.target.value)} type="text" placeholder="Username" pattern="[A-Za-z][A-Za-z0-9\-]*" minLength="3" maxLength="30" title="Only letters, numbers or dash"/>
              
              </label>
                  <p className="validator-hint text-[#7a5830]">
                    Must be 3 to 30 characters
                    <br />containing only letters, numbers or dash
                  </p>


                {/* Password */}
                <label className="input validator w-full border-[#d8b36b] bg-white text-[#2d1208]">
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path
                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                      ></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
  
                  <input value={data.password} onChange={(e) => setData('password', e.target.value)} type="text" placeholder="Password" minLength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
              </label>
              <p className="validator-hint hidden text-[#7a5830]">
                Must be more than 8 characters, including
                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
              </p>


              {/* Select Role */}
              <select value={data.role} onChange={(e) => setData('role', e.target.value)} className="select mt-5 w-full border-[#d8b36b] bg-white text-[#2d1208]">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="receiver">Receiver</option>
                <option value="endorser">Endorser</option>
                <option value="head">Head</option>
                <option value="department">Department</option>
              </select>


            {/* if user is department */}
            {data.role === 'department' && (
              <div>
                <label className="input validator w-full border-[#d8b36b] bg-white text-[#2d1208]">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>

                  <input required value={data.role_department} onChange={(e) => setData('role_department', e.target.value)} type="text" placeholder="Role" maxLength="30" title="Department"/>
              </label>
              </div>
            )}


            {/* Submit Button */}
            <button className="btn border-0 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] text-white hover:from-[#6f1515] hover:via-[#9e1f1f] hover:to-[#b88d11]">Edit User</button>
          </form>

          
          </div>
        </dialog>
      )}

      
      {/* Delete User(soft delete) */}
      {deleteModal && (
        <dialog className="modal modal-open">
          <div className="modal-box border border-[#e4c57c]/70 bg-[#fffdf8] shadow-[0_24px_70px_rgba(78,34,16,0.18)]">
            <button
              className="btn btn-sm btn-circle border-0 bg-[#8b1c1c] text-white absolute right-2 top-2 hover:bg-[#6f1515]"
              onClick={() => setDeleteModal(false)}
            >
              ✕
            </button>
            <p className="text-[#2d1208]">Are you sure you want to DELETE this user? ({data.username})</p>
            <div className="flex flex-row justify-center gap-2 mt-4">
              <button onClick={(e) => deleteUser(e, data.user_id)} className="btn border-0 bg-[#d4a017] text-[#2d1208] hover:bg-[#b88d11] w-10">Yes</button>
              <button onClick={() => setDeleteModal(false)} className="btn border-0 bg-[#8b1c1c] text-white hover:bg-[#6f1515] w-10">No</button>
            </div>
          </div>
        </dialog>
      )}


      {/* Create User */}
      {createUserModal && (
        <dialog className="modal modal-open">
          <div className="modal-box border border-[#e4c57c]/70 bg-[#fffdf8] shadow-[0_24px_70px_rgba(78,34,16,0.18)]">
            <button
              className="btn btn-sm btn-circle border-0 bg-[#8b1c1c] text-white absolute right-2 top-2 hover:bg-[#6f1515]"
              onClick={() => setcreateUserModal(false)}
            >
              ✕
            </button>

            <form onSubmit={createUser} className="flex flex-col justify-center items-center gap-2">

              <h3 className="font-bold text-lg m-4 text-[#2d1208]">Create User</h3>
            
              {/* username Input */}
              <label className="input validator w-full border-[#d8b36b] bg-white text-[#2d1208]">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>

                  <input value={data.username} onChange={(e) => setData('username', e.target.value)} type="text" required placeholder="Username" pattern="[A-Za-z][A-Za-z0-9\-]*" minLength="3" maxLength="30" title="Only letters, numbers or dash"/>
              
              </label>  
                  <p className="validator-hint text-[#7a5830]">
                    Must be 3 to 30 characters
                    <br />containing only letters, numbers or dash
                  </p>


                {/* Password */}
                <label className="input validator w-full border-[#d8b36b] bg-white text-[#2d1208]">
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path
                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                      ></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
  
                  <input value={data.password} onChange={(e) => setData('password', e.target.value)} type="text" required placeholder="Password" minLength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
              </label>
              <p className="validator-hint hidden text-[#7a5830]">
                Must be more than 8 characters, including
                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
              </p>


              {/* Select Role */}
              <select required value={data.role} onChange={(e) => setData('role', e.target.value)} className="select mt-5 w-full border-[#d8b36b] bg-white text-[#2d1208]">
                <option value="" disabled>Select Role</option>
                <option value="admin">Admin</option>
                <option value="receiver">Receiver</option>
                <option value="endorser">Endorser</option>
                <option value="head">Head</option>
                <option value="department">Department</option>
              </select>
              <p className="validator-hint hidden text-[#7a5830]">
                Role is required
              </p>


            {/* if user is department */}
            {data.role === 'department' && (
              <div>
                <label className="input validator w-full border-[#d8b36b] bg-white text-[#2d1208]">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
              </svg>

                  <input value={data.role_department} onChange={(e) => setData('role_department', e.target.value)} type="text" required placeholder="Department" maxLength="30" title="Department"/>
              </label>
              </div>
            )}


            {/* Submit Button */}
            <button className="btn border-0 p-2 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] text-white hover:from-[#6f1515] hover:via-[#9e1f1f] hover:to-[#b88d11]">Create User</button>
          </form>

          
          </div>
        </dialog>
      )}


    </div>
    </SidebarLayout>
  )
}