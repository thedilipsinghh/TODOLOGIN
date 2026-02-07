"use client"
import { Provider } from "react-redux"
import reduxStore from "./store"

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
    return <>
        <Provider store={reduxStore}>
            {children}
        </Provider>
    </>
}

export default ReduxProvider