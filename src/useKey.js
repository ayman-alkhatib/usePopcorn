import { useEffect } from "react";

export function useKey(key, action) {
    useEffect(() => {

        function callbackfn(e) {
            if (e.code.toLowerCase() === key.toLowerCase()) {
                action()
            }
        }

        document.addEventListener("keydown", callbackfn)

        return () => {
            document.removeEventListener("keydown", callbackfn)
        }

    }, [action, key])

}