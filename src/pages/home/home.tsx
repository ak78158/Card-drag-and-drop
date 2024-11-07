import { useEffect, useState } from "react";
import { data } from "../../data/data";
import Styles from "./home.module.scss";
import Card from "../../components/Card/Card";
import ImageModal from "../../components/imageModal/ImageModal";
import { ProductType, Property } from "../../types/types";
import AutoSaveComponent from "../../components/autoSave/AutoSave";

const fetchProperties = async (): Promise<Property[]> => {
  const response = await fetch("/data");
  const contentType = response.headers.get("Content-Type");

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Expected JSON, but got " + contentType);
  }

  const data = await response.json();
  return data;
};

const Home = () => {
  const [productData, setProductData] = useState<ProductType[]>([]);

  useEffect(() => {
    console.log("res in home");
    fetchProperties().then((data) => {
      console.log("Data", data);
      setProductData(
        data?.map((item, index) => {
          return {
            ...item,
            iconLink: `https://placehold.jp/30/${index}6${index}999/ffffff/200x200.png?text=${item?.title}`,
          };
        }),
      );
    });
  }, []);

  const [draggedPosition, setDraggedPosition] = useState<number | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const onDragStart = (position: number | null) => {
    setDraggedPosition(position);
  };

  const onDragEnter = (position: number | null) => {
    setHoveredPosition(position);
  };

  const onDragEnd = () => {
    setDraggedPosition(null);
    setHoveredPosition(null);
  };

  const onDrop = () => {
    if (draggedPosition === null || hoveredPosition === null) return;

    // Get the dragged and hovered items by their positions
    const draggedItemIndex = productData?.findIndex(
      (item) => item.position === draggedPosition,
    );
    const hoveredItemIndex = productData?.findIndex(
      (item) => item.position === hoveredPosition,
    );

    const updatedData = [...(productData || [])];
    const [draggedItem] = updatedData.splice(draggedItemIndex, 1);
    updatedData.splice(hoveredItemIndex, 0, draggedItem);

    const updatedDataWithPositions = updatedData.map((item, index) => ({
      ...item,
      position: index,
    }));

    setHasChanges(true);
    setProductData(updatedDataWithPositions);

    // Reset drag states
    onDragEnd();
  };

  const [loadingImages, setLoadingImages] = useState(
    data.reduce((acc, item) => ({ ...acc, [item.position]: true }), {}),
  );

  const handleImageLoad = (position: number) => {
    setLoadingImages((prev) => ({ ...prev, [position]: false }));
  };

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };
  console.log("product data", productData);

  return (
    <>
      <AutoSaveComponent
        data={productData}
        hasChanges={hasChanges}
        setHasChanges={setHasChanges}
      />
      <div className={Styles.cardContainer}>
        {productData?.map((item, index) => {
          return (
            <Card
              cardItem={item}
              index={index}
              key={item.position}
              loadingImages={loadingImages}
              handleImageLoad={handleImageLoad}
              onDragStart={() => onDragStart(item.position)}
              onDragEnter={() => onDragEnter(item.position)}
              onClick={() => openImageModal(`${item.iconLink}`)}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              isDragging={item.position === draggedPosition}
              isHovered={item.position === hoveredPosition}
            />
          );
        })}

        {modalImage && (
          <ImageModal imageUrl={modalImage} onClose={closeImageModal} />
        )}
      </div>
    </>
  );
};

export default Home;
