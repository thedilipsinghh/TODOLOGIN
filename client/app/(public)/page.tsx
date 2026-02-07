"use client"
import { useSigninMutation } from "@/redux/apis/auth.api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z from "zod"

const Login = () => {
  const router = useRouter()
  const [signin] = useSigninMutation()

  const loginSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
  })

  type loginType = z.infer<typeof loginSchema>

  const { reset, register, handleSubmit, formState: { errors } } = useForm<loginType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema)
  })

  const handleLogin = async (data: loginType) => {
    try {
      await signin(data).unwrap()
      toast.success("user login success")
      reset()
      router.push("/admin")
    } catch (error) {
      console.log(error)
      toast.error("unable to login")
    }
  }

  return <>
    {/* <form onSubmit={handleSubmit(handleLogin)}>
      <input type="email"  {...register("email")} />
      <input type="password"  {...register("password")} />
      <button type="submit">login</button>
    </form> */}

    <form
      onSubmit={handleSubmit(handleLogin)}
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">

        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Login
        </h2>

        {/* Email */}
        <div className="space-y-1">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900
              placeholder-gray-400 focus:outline-none focus:ring-2 transition
              ${errors.email
                ? "border-red-500 ring-red-500"
                : "border-gray-300 focus:ring-black"}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900
              placeholder-gray-400 focus:outline-none focus:ring-2 transition
              ${errors.password
                ? "border-red-500 ring-red-500"
                : "border-gray-300 focus:ring-black"}`}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl font-medium
                     hover:opacity-90 active:scale-95 transition"
        >
          Login
        </button>

      </div>
    </form>
  </>
}

export default Login