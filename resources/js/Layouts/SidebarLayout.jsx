import { Link, useForm, usePage, router } from "@inertiajs/react"

export default function({children}){
    const {post, data, setData} = useForm()
    const {auth} = usePage().props
    const currentRoute = route().current()
    
    function logout(){
        post(route('logout'))
    }
    return(
    <div className="drawer lg:drawer-open">
    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
        <div className="flex-1">
            <div className="px-4">Mezzanine</div>
        </div>

        <div className="flex-none">
           {auth.user.image?(
            <img src={`/storage/${auth.user.image}`} alt="" className="ml-2 rounded-full h-10 w-10"/>
           ) : (
            <div className="ml-2 rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-bold">{auth.user.username.toUpperCase().slice(0, 1)}</span>
            </div>
           )}

        </div>
        </nav>
        {/* Page content here */}
        <div className="p-4">{children}</div>
    </div>

    <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex min-h-full flex-col items-center bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
        {/* Sidebar content here */}
        <ul className="menu w-auto flex items-start gap-2 grow mt-20">
         

         {/* Open Sidebar */}
          <li className="flex items-center">
            <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
            </label>
            </li>
         
           {/* Admin Createe User */}
           {auth.user.role === 'admin' && (
            <Link href={route('admin_page')}>
            <li className={`flex items-center w-full ${currentRoute === 'admin_page' ? 'bg-black text-primary-content rounded-md' : ''}`}>
            <div className="tooltip tooltip-close tooltip-right w-full">
            <button className="btn w-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-1.5 inline-block size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
                <span className="is-drawer-close:hidden">Create User</span></button>
            </div>
            </li>
           </Link>
           )}
           
           
           {/* Head Graphs Page */}
           {auth.user.role === 'head' && (
            <Link href={route('head_page')}>
            <li className={`flex items-center w-full ${currentRoute === 'head_page' ? 'bg-black text-primary-content rounded-md' : ''}`}>
            <div className="tooltip tooltip-close tooltip-right w-full">
            <button className="btn w-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-1.5 inline-block size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
                <span className="is-drawer-close:hidden">Inventory Graph</span></button>
            </div>
            </li>
           </Link>
           )}
           
           
           {/* Head Reports Page */}
           {auth.user.role === 'head' && (
            <Link href={route('head_report_page')}>
            <li className={`flex items-center w-full ${currentRoute === 'head_report_page' ? 'bg-black text-primary-content rounded-md' : ''}`}>
            <div className="tooltip tooltip-close tooltip-right w-full">
            <button className="btn w-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-1.5 inline-block size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
            </svg>
                <span className="is-drawer-close:hidden">Reports</span></button>
            </div>
            </li>
           </Link>
           )}


           {/* Receiver Create Item */}
           {auth.user.role === 'receiver' && (
            <Link href={route('receiver_page')}>
            <li className={`flex items-center w-full ${currentRoute === 'receiver_page' ? 'bg-black text-primary-content rounded-md' : ''}`}>
            <div className="tooltip tooltip-close tooltip-right w-full">
            <button className="btn w-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-1.5 inline-block size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
                <span className="is-drawer-close:hidden">Create Item</span></button>
            </div>
            </li>
           </Link>
           )}
           
           
           {/* Endorser Action Page */}
           {auth.user.role === 'endorser' && (
            <Link href={route('endorser_page')}>
            <li className={`flex items-center w-full ${currentRoute === 'endorser_page' ? 'bg-black text-primary-content rounded-md' : ''}`}>
            <div className="tooltip tooltip-close tooltip-right w-full">
            <button className="btn w-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-1.5 inline-block size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
            </svg>
                <span className="is-drawer-close:hidden">Requests</span></button>
            </div>
            </li>
           </Link>
           )}
           
           
           {/* Endorser Done Requests */}
           {auth.user.role === 'endorser' && (
            <Link href={route('endorser_done_request_page')}>
            <li className={`flex items-center w-full ${currentRoute === 'endorser_done_request_page' ? 'bg-black text-primary-content rounded-md' : ''}`}>
            <div className="tooltip tooltip-close tooltip-right w-full">
            <button className="btn w-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-1.5 inline-block size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
                <span className="is-drawer-close:hidden">Done Requests</span></button>
            </div>
            </li>
           </Link>
           )}
          
          
          {/* Department Request item */}
           {auth.user.role === 'department' && (
            <Link href={route('department_page')}>
            <li className={`flex items-center w-full ${currentRoute === 'department_page' ? 'bg-black text-primary-content rounded-md' : ''}`}>
            <div className="tooltip tooltip-close tooltip-right w-full">
            <button className="btn w-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-1.5 inline-block size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
                <span className="is-drawer-close:hidden">Create Request</span></button>
            </div>
            </li>
           </Link>
           )}


            {/* Department Profile */}
            {auth.user.role === 'department' && (
            <Link href={route('profile_department_page')}>
            <li className={`flex items-center w-full ${currentRoute === 'profile_department_page' ? 'bg-black text-primary-content rounded-md' : ''}`}>
            <div className="tooltip tooltip-close tooltip-right w-full">
            <button className="btn w-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-1.5 inline-block size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span className="is-drawer-close:hidden">Profile</span>
            </button>
            </div>
            </li>
            </Link>
            )}


            {/* Logout Button */}
            <li className="flex items-center absolute bottom-0 flex-0">
            <div className="tooltip tooltip-close tooltip-right">
            <button onClick={logout} className="btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-1.5 inline-block size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
                <span className="is-drawer-close:hidden">Logout</span>
            </button>
            </div>
            </li>
        </ul>
        </div>
    </div>
    </div>
    )
}