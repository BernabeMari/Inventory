import { useForm, usePage } from "@inertiajs/react"

export default function(){
    const {post, setData, data} = useForm({
        username: '',
        password: '',
        role: '',
    })
    function login(e){
        e.preventDefault()
        post(route('login'))
    }

    const {flash} = usePage().props
    return(
    <div className="min-h-screen relative overflow-hidden bg-[#f9f3e8] text-[#2d1208]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(185,28,28,0.24),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(180,128,0,0.18),_transparent_28%),linear-gradient(135deg,_#fff8ef_0%,_#f7e7d2_48%,_#fffdf8_100%)]" />
      <div className="absolute left-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-[#b91c1c]/20 blur-3xl" />
      <div className="absolute right-[-5rem] bottom-[-5rem] h-80 w-80 rounded-full bg-[#d4a017]/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#d7b46a]/50 bg-gradient-to-br from-[#8b1c1c] via-[#aa2222] to-[#5a110f] p-10 text-white shadow-[0_30px_80px_rgba(122,24,24,0.35)]">
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20 backdrop-blur">
              <img src="/storage/tcu-logo.jpg" alt="Taguig City University" className="h-12 w-12 rounded-full object-cover" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#f2d48a]">Inventory Portal</p>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">Office Supply</h1>
            </div>
          </div>

          <div className="relative mt-10 max-w-xl">
            <span className="inline-flex rounded-full border border-[#f2d48a]/50 bg-white/10 px-4 py-2 text-sm font-semibold text-[#f8e6b8] shadow-lg backdrop-blur">
              Secure access for department, head, receiver, admin, and endorser workflows
            </span>
            <p className="mt-6 text-base leading-8 text-white/85 md:text-lg">
              Manage requests, approvals, receipts, and issuances inside a clean system built for fast inventory decisions.
              The interface stays focused, readable, and consistent with the shared sidebar styling.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur">
                <p className="text-sm text-[#f3d89b]">Fast review</p>
                <p className="mt-1 text-lg font-bold">Requests</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur">
                <p className="text-sm text-[#f3d89b]">Precise stock</p>
                <p className="mt-1 text-lg font-bold">Inventory</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur">
                <p className="text-sm text-[#f3d89b]">Clear workflow</p>
                <p className="mt-1 text-lg font-bold">Approvals</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] bg-[#d4a017]/30 blur-2xl" />
          <div className="relative rounded-[2rem] border border-[#e6c87b]/70 bg-white/85 px-8 py-10 shadow-[0_24px_70px_rgba(78,34,16,0.18)] backdrop-blur-xl">
            <div className="mb-8 text-left">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#b91c1c]">Welcome back</p>
              <h2 className="mt-2 text-4xl font-black text-[#2d1208]">Login</h2>
              <p className="mt-3 text-sm leading-6 text-[#6b4b2f]">
                Sign in to continue into the inventory dashboard.
              </p>
            </div>

            <form onSubmit={login} className="space-y-4">
              {flash.error && (<div className="alert border border-[#efc5c5] bg-[#fff3f3] text-[#8b1c1c] mb-4">
              {flash.error}
              </div>)}

              <label className="form-control w-full">
                <div className="label pb-2">
                  <span className="label-text font-semibold text-[#4a2814]">Email</span>
                </div>
                <input
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                  type="text"
                  placeholder="Enter your email"
                  className="input input-bordered h-12 w-full border-[#d8b36b] bg-white text-[#2d1208] placeholder:text-[#b28f68] focus:border-[#b91c1c] focus:outline-none"
                />
              </label>

              <label className="form-control w-full">
                <div className="label pb-2">
                  <span className="label-text font-semibold text-[#4a2814]">Password</span>
                </div>
                <input
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered h-12 w-full border-[#d8b36b] bg-white text-[#2d1208] placeholder:text-[#b28f68] focus:border-[#b91c1c] focus:outline-none"
                />
              </label>

              <button
                type="submit"
                className="btn w-full border-0 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] text-white shadow-lg shadow-[#8b1c1c]/25 hover:from-[#6f1515] hover:via-[#9e1f1f] hover:to-[#b88d11]"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    )
}