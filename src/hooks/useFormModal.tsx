import { useState } from "react";

export const useFormModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const onOpenModal = () => setIsOpen(true);
    const onCloseModal = () => setIsOpen(false);
    return { isOpen, onOpenModal, onCloseModal };
};
