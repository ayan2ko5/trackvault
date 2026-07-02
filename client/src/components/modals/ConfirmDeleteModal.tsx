
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting?: boolean;
    title?: string;
    description?: string;
}

const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    isDeleting = false,
    title = "Confirm Delete",
    description = "This action cannot be undone.",
}: ConfirmDeleteModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="text-center">

                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-rose-500" />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {description}
                </p>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        fullWidth
                        onClick={onConfirm}
                        isLoading={isDeleting}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;