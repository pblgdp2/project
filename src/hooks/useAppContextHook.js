import { useContext } from "react"
import { AppContextDispatchProvider, AppContextStateProvider } from "./appContext";

export default function useAppContext() {
    const appState = useContext(AppContextStateProvider);
    const dispatch = useContext(AppContextDispatchProvider);

    return {
        appState,
        dispatch
    }
}