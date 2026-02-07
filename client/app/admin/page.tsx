"use client"
import { useAddTodoMutation, useDeleteTodoMutation, useGetTodosQuery, useUpdateTodoMutation } from "@/redux/apis/todo.api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

const Dashboard = () => {
    const { data } = useGetTodosQuery()
    const [addTodo] = useAddTodoMutation()
    const [updateTodo] = useUpdateTodoMutation()
    const [deleteTodo] = useDeleteTodoMutation()

    const todoSchema = z.object({
        task: z.string().min(1),
        desc: z.string().min(1),
        priority: z.string().min(1),
    })

    type todoType = z.infer<typeof todoSchema>

    const { reset, register, handleSubmit, formState: { errors } } = useForm<todoType>({
        defaultValues: {
            task: "",
            desc: "",
            priority: ""
        },
        resolver: zodResolver(todoSchema)
    })

    const handleCreate = (values: todoType) => {
        handleAdd(values)
        reset()
    }

    const handleAdd = async (data: todoType) => {
        try {
            await addTodo(data).unwrap()
            console.log("todo create success")
        } catch (error) {
            console.log(error)
        }
    }
    const handleUpdate = async (data: todoType, isComplete: boolean) => {
        try {
            await updateTodo({ ...data, complete: isComplete }).unwrap()
            console.log("todo update success")
        } catch (error) {
            console.log(error)
        }
    }
    const handleDelete = async (_id: string) => {
        try {
            await deleteTodo(_id).unwrap()
            console.log("todo delete success")
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <form
            onSubmit={handleSubmit(handleCreate)}
            className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
        >
            <input
                {...register("task")}
                type="text"
                placeholder="enter task"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
                {...register("desc")}
                type="text"
                placeholder="enter desc"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <select
                {...register("priority")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
            >
                <option value="">Choose priority</option>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
            </select>

            <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 active:scale-95 transition"
            >
                add todo
            </button>
        </form>

        <br />
        <br />
        <br />

        {data && (
            <table className="w-full max-w-5xl mx-auto bg-white shadow rounded-xl overflow-hidden text-gray-900 text-sm">

                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">id</th>
                        <th className="p-3 text-left">task</th>
                        <th className="p-3 text-left">desc</th>
                        <th className="p-3 text-left">priority</th>
                        <th className="p-3 text-left">complete</th>
                        <th className="p-3 text-left">actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item) => (
                        <tr
                            key={item._id}
                            className={`border-t hover:bg-gray-50 ${item.complete ? "bg-green-50" : ""
                                }`}
                        >
                            <td className="p-3 font-mono text-xs break-all">{item._id}</td>

                            <td className="p-3 font-medium">{item.task}</td>

                            <td className="p-3 text-gray-600">{item.desc}</td>

                            <td className="p-3 capitalize">{item.priority}</td>

                            <td className="p-3">
                                {item.complete ? (
                                    <span className="text-green-600 font-medium">Complete</span>
                                ) : (
                                    <span className="text-red-600 font-medium">Pending</span>
                                )}
                            </td>

                            <td className="p-3 flex gap-2">
                                {item.complete ? (
                                    <button
                                        onClick={() => handleUpdate(item, false)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                                    >
                                        Mark In Complete
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleUpdate(item, true)}
                                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                    >
                                        Mark Complete
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(item._id as string)}
                                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

    </>
}

export default Dashboard