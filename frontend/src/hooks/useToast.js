import { useEffect, useRef, useState } from "react";

export function useToast(timeout = 3200) {
    const [toast, setToast] = useState(null);
    const toastTimerRef = useRef(null);

    useEffect(() => () => {
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }
    }, []);

    function showToast(message, type = "info") {
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }

        setToast({ message, type });

        toastTimerRef.current = setTimeout(() => {
            setToast(null);
        }, timeout);
    }

    return {
        toast,
        showToast,
    };
}
