import SidebarLayout from "@/Layouts/SidebarLayout";
import SearchField from "@/Components/SearchField";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import React from 'react';

export default function(){
    const { audits, filters } = usePage().props
    const [search, setSearch] = useState(filters?.search ?? '')

    function handleSearch(e){
        const value = e.target.value
        setSearch(value)
        router.get(route('admin_audit_logs_page'), { search: value }, { preserveState: true, replace: true })
    }

    return(
        <SidebarLayout>
            <div className="flex-col flex overflow-auto">
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#b91c1c]">Admin</p>
                <h3 className="font-bold text-3xl m-4 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent">Audit Logs</h3>

                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <SearchField value={search} onChange={handleSearch} placeholder="Search audit logs..." />
                        <button type="button" value="" onClick={handleSearch} className="btn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-sm text-[#5b3a18]">Total records: {audits?.total ?? 0}</p>
                </div>

                <div className="flex justify-center items-center p-4 overflow-x-auto">
                    <table className="w-full border-collapse border border-[#d8b36b]">
                        <thead className="bg-gradient-to-r from-[#7f1717] via-[#a91f1f] to-[#c99a1b]">
                            <tr>
                                <th className="border border-[#d8b36b] text-white p-3 font-semibold">TIME</th>
                                <th className="border border-[#d8b36b] text-white p-3 font-semibold">USER</th>
                                <th className="border border-[#d8b36b] text-white p-3 font-semibold">ROLE</th>
                                <th className="border border-[#d8b36b] text-white p-3 font-semibold">METHOD</th>
                                <th className="border border-[#d8b36b] text-white p-3 font-semibold">ACTION</th>
                                <th className="border border-[#d8b36b] text-white p-3 font-semibold">STATUS</th>
                                <th className="border border-[#d8b36b] text-white p-3 font-semibold">IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audits?.data?.length ? (
                                audits.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-[#fff7ea]">
                                        <td className="border border-[#d8b36b] p-2 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                                        <td className="border border-[#d8b36b] p-2">{log.username || 'Guest'}</td>
                                        <td className="border border-[#d8b36b] p-2">{log.role || '-'}</td>
                                        <td className="border border-[#d8b36b] p-2">
                                            <span className="px-2 py-1 rounded bg-[#f3e5c9] font-semibold text-xs">{log.method}</span>
                                        </td>
                                        <td className="border border-[#d8b36b] p-2 max-w-[28rem] truncate" title={log.action}>{log.action}</td>
                                        <td className="border border-[#d8b36b] p-2">{log.status_code}</td>
                                        <td className="border border-[#d8b36b] p-2">{log.ip_address || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="border border-[#d8b36b] p-4 text-center text-gray-600" colSpan={7}>No audit logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {audits?.links?.length > 3 && (
                    <div className="px-4 pb-4 flex flex-wrap items-center justify-center gap-2">
                        {audits.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url || '#'}
                                preserveScroll
                                className={`px-3 py-1 rounded-md text-sm border transition ${
                                    link.active
                                        ? 'bg-[#8b1c1c] text-white border-[#8b1c1c]'
                                        : link.url
                                        ? 'bg-white text-[#2d1208] border-[#d8b36b] hover:bg-[#fff7ea]'
                                        : 'bg-gray-100 text-gray-400 border-gray-200 pointer-events-none'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </SidebarLayout>
    )
}