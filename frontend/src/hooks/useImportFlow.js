import { useRef, useState } from "react";

import { importResumeFromPdfWithValidation } from "../services/importResumeFlow";
import { mergeResume } from "../domain/resumeUtils";
import { UI_TEXT } from "../content/uiText.pt-br";

export function useImportFlow({ resume, setResume, showToast, setLoadingAction, onHideTutorial }) {
    const [importDraft, setImportDraft] = useState(null);
    const [importMode, setImportMode] = useState("merge");
    const fileInputRef = useRef(null);

    function handleImportPdfClick() {
        fileInputRef.current?.click();
    }

    async function handleImportPdfSelected(event) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) {
            return;
        }

        onHideTutorial?.();

        if (file.type && file.type !== "application/pdf") {
            showToast(UI_TEXT.toasts.importInvalid, "error");
            return;
        }

        const maxPdfBytes = 5 * 1024 * 1024;
        if (file.size > maxPdfBytes) {
            showToast(UI_TEXT.toasts.importTooLarge, "error");
            return;
        }

        setLoadingAction("import");
        showToast(UI_TEXT.toasts.importProcessing, "info");

        try {
            const data = await importResumeFromPdfWithValidation(file);
            setImportDraft(data);
            setImportMode("merge");
            showToast(UI_TEXT.toasts.importExtracted, "info");
        } catch (err) {
            console.error(err);
            showToast(`${UI_TEXT.toasts.importError} ${err.message}`, "error");
        } finally {
            setLoadingAction(null);
        }
    }

    function handleImportCancel() {
        setImportDraft(null);
    }

    function handleImportApply() {
        if (!importDraft) {
            return;
        }

        const nextResume = importMode === "replace"
            ? importDraft
            : mergeResume(resume, importDraft);

        setResume(nextResume);
        setImportDraft(null);
        onHideTutorial?.();
        showToast(UI_TEXT.toasts.importApplied, "success");
    }

    return {
        fileInputRef,
        importDraft,
        importMode,
        setImportMode,
        handleImportPdfClick,
        handleImportPdfSelected,
        handleImportCancel,
        handleImportApply,
    };
}
