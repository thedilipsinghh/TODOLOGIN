import { APP_URL } from "@/constant/config"
import { Todo } from "@/types/Todo"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const todoApi = createApi({
    reducerPath: "todoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${APP_URL}/api/todo`,
        credentials: "include" // very imp for cookies to work
    }),
    tagTypes: ["todo"],
    endpoints: (builder) => {
        return {
            getTodos: builder.query<Todo[], void>({
                query: () => {
                    return {
                        url: "/",
                        method: "GET"
                    }
                },
                providesTags: ["todo"]
            }),
            addTodo: builder.mutation<void, Todo>({
                query: tododata => {
                    return {
                        url: "/create",
                        method: "POST",
                        body: tododata
                    }
                },
                invalidatesTags: ["todo"]
            }),
            updateTodo: builder.mutation<void, Todo>({
                query: tododata => {
                    return {
                        url: "/modify/" + tododata._id as string,
                        method: "PATCH",
                        body: tododata
                    }
                },
                invalidatesTags: ["todo"]
            }),
            deleteTodo: builder.mutation<void, string>({
                query: _id => {
                    return {
                        url: "/remove/" + _id,
                        method: "DELETE",
                    }
                },
                invalidatesTags: ["todo"]
            }),

        }
    }
})

export const {
    useAddTodoMutation,
    useDeleteTodoMutation,
    useGetTodosQuery,
    useUpdateTodoMutation
} = todoApi
