export function useArrayField({ setResume, fieldKey, createEmptyItem, minItems = 1 }) {
    function addItem() {
        setResume((prev) => ({
            ...prev,
            [fieldKey]: [...prev[fieldKey], createEmptyItem()],
        }));
    }

    function updateItem(index, key, value) {
        setResume((prev) => {
            const updated = [...prev[fieldKey]];
            updated[index] = {
                ...updated[index],
                [key]: value,
            };

            return {
                ...prev,
                [fieldKey]: updated,
            };
        });
    }

    function removeItem(index) {
        setResume((prev) => {
            if (prev[fieldKey].length <= minItems) {
                return prev;
            }

            return {
                ...prev,
                [fieldKey]: prev[fieldKey].filter((_, i) => i !== index),
            };
        });
    }

    return {
        addItem,
        updateItem,
        removeItem,
    };
}
