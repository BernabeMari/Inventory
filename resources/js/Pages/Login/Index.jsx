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
        <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left">
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body w-80">
        <h1 className="text-5xl font-bold">LOGIN</h1>
        <p className="py-0">
        sadasdasdas
        </p>

        <form onSubmit={login} className="fieldset m-4">
          {flash.error && (<div className="alert alert-error mb-4">
        {flash.error}
          </div>)}
          <label className="label">Email</label>
          <input value={data.username} onChange={(e) => setData('username', e.target.value)} type="text" className="input border border-black" />
          <label className="label">Password</label>
          <input value={data.password} onChange={(e) => setData('password', e.target.value)} type="password" className="input border border-black" />
          <button type="submit" className="btn btn-neutral mt-4">Login</button>
        </form>
      </div>
    </div>
  </div>
</div>
    )
}