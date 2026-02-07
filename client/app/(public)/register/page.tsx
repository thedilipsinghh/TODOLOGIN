"use client"
import { useSignupMutation } from "@/redux/apis/auth.api"
import { User } from "@/types/User"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z from "zod"

const Register = () => {
    const router = useRouter()
    const [signup] = useSignupMutation()
    const registerSchema = z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
    })

    type registerType = z.infer<typeof registerSchema>

    const { reset, register, handleSubmit, formState: { errors } } = useForm<registerType>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        resolver: zodResolver(registerSchema)
    })

    const handleLogin = async (data: registerType) => {
        try {
            await signup(data).unwrap()
            toast.success("register success")
            reset()
            router.push("/")
        } catch (error) {
            console.log(error)
            toast.error("unable to register")
        }
    }

    return <>
        {/* <form onSubmit={handleSubmit(handleLogin)}>
            <input type="text"  {...register("name")} />
            <input type="email"  {...register("email")} />
            <input type="password"  {...register("password")} />
            <button type="submit">Register</button>
        </form> */}
        <form
            onSubmit={handleSubmit(handleLogin)}
            className="min-h-screen flex items-center justify-center bg-gray-100"
        >
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5">

                <h2 className="text-2xl font-semibold text-center text-gray-900">
                    Create Account
                </h2>

                {["name", "email", "password"].map((field) => (
                    <input
                        key={field}
                        type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                        placeholder={field}
                        {...register(field as any)}
                        className="w-full px-4 py-3 border rounded-xl
                   bg-white text-gray-900
                   placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-black"
                    />
                ))}

                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90"
                >
                    Register
                </button>

            </div>
        </form>

    </>
}

export default Register