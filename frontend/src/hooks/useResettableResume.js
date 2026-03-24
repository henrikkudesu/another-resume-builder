import { useEffect, useRef, useState } from "react";

export function useResettableResume({ setResume, emptyResume, storageKey, undoTimeoutMs = 12000 }) {
    const [undoResetVisible, setUndoResetVisible] = useState(false);
    const resetUndoTimerRef = useRef(null);
    const lastResumeSnapshotRef = useRef(null);

    useEffect(() => () => {
        if (resetUndoTimerRef.current) {
            clearTimeout(resetUndoTimerRef.current);
        }
    }, []);

    function clearResetUndoTimer() {
        if (resetUndoTimerRef.current) {
            clearTimeout(resetUndoTimerRef.current);
            resetUndoTimerRef.current = null;
        }
    }

    function resetResume(currentResume) {
        lastResumeSnapshotRef.current = currentResume;
        setResume(JSON.parse(JSON.stringify(emptyResume)));
        localStorage.removeItem(storageKey);
        setUndoResetVisible(true);

        clearResetUndoTimer();
        resetUndoTimerRef.current = setTimeout(() => {
            setUndoResetVisible(false);
            lastResumeSnapshotRef.current = null;
        }, undoTimeoutMs);
    }

    function undoReset() {
        if (!lastResumeSnapshotRef.current) {
            return false;
        }

        setResume(lastResumeSnapshotRef.current);
        lastResumeSnapshotRef.current = null;
        setUndoResetVisible(false);
        clearResetUndoTimer();
        return true;
    }

    return {
        undoResetVisible,
        resetResume,
        undoReset,
    };
}
