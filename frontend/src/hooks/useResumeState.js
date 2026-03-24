import { useEffect, useState } from "react";

import { EMPTY_RESUME, JOHN_DOE_RESUME, STORAGE_KEY } from "../domain/resumeDefaults";
import { getInitialResume } from "../domain/resumeNormalization";

export function useResumeState() {
    const [resume, setResumeState] = useState(() => getInitialResume(STORAGE_KEY, JOHN_DOE_RESUME, EMPTY_RESUME));
    const [saveState, setSaveState] = useState("saved");
    const [lastSavedAt, setLastSavedAt] = useState(() => new Date());

    function setResume(nextResume) {
        setSaveState("saving");
        setResumeState((previousResume) => (
            typeof nextResume === "function" ? nextResume(previousResume) : nextResume
        ));
    }

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));

        const timer = setTimeout(() => {
            setSaveState("saved");
            setLastSavedAt(new Date());
        }, 250);

        return () => clearTimeout(timer);
    }, [resume]);

    function markSaved() {
        setSaveState("saved");
        setLastSavedAt(new Date());
    }

    function getSaveStatusText() {
        if (saveState === "saving") {
            return "Salvando...";
        }

        return `Salvo localmente as ${lastSavedAt.toLocaleTimeString()}`;
    }

    return {
        resume,
        setResume,
        saveState,
        lastSavedAt,
        markSaved,
        getSaveStatusText,
    };
}
