import { useState, useCallback } from "react";
import { playSound } from "../utils/soundUtils";

/**
 * Custom hook for managing modals
 * @returns {Object} Modal state and functions
 */
function useGameModal() {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(null);
  const [modalActionText, setModalActionText] = useState(null);

  const showSuccessModal = useCallback((message = "Congratulations! You've solved the puzzle correctly!") => {
    playSound("congratulations");
    setModalMessage(message);
    setModalAction(null);
    setModalActionText(null);
    setShowModal(true);
  }, []);

  const showErrorModal = useCallback((message = "Oops! There are some mistakes in your solution.", action = null, actionText = null) => {
    playSound("failed");
    setModalMessage(message);
    setModalAction(() => action);
    setModalActionText(actionText);
    setShowModal(true);
  }, []);

  const hideModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const modalProps = {
    showModal,
    message: modalMessage,
    onClose: hideModal,
    onAction: modalAction,
    actionText: modalActionText,
  };

  return {
    showSuccessModal,
    showErrorModal,
    modalProps,
  };
}

export default useGameModal;
