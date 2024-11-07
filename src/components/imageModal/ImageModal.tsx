import { useEffect } from "react";
import styles from "./imageModal.module.scss";

interface ImageModalProp {
  imageUrl: string;
  onClose: () => void;
}
const ImageModal: React.FC<ImageModalProp> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Enlarged view" />
      </div>
    </div>
  );
};

export default ImageModal;
