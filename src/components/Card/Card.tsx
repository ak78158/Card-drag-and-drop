import Styles from "./card.module.scss";

type CardDetails = {
  position: number;
  iconLink: string;
  title: string;
  type: string;
};

type CardItemProp = {
  cardItem: CardDetails;
  index: number;
  loadingImages: { [position: number]: boolean };
  handleImageLoad: (position: number) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onClick: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
  isDragging: boolean;
  isHovered: boolean;
};

const Card: React.FC<CardItemProp> = ({
  cardItem,
  index,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onClick,
  onDrop,
  isDragging,
  isHovered,
  loadingImages,
  handleImageLoad,
}) => {
  return (
    <div
      key={cardItem.position}
      className={`${Styles.card} ${isDragging ? Styles.dragging : ""} ${isHovered ? Styles.hovered : ""}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={(e) => {
        console.log("drag enter");
        e.preventDefault();
        onDragEnter(index);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={onDragEnd}
      onDrop={(e) => {
        console.log("drag drop");
        e.preventDefault();
        onDrop();
      }}
      onClick={onClick}
    >
      <span>{cardItem.title}</span>
      {loadingImages[cardItem.position] && (
        <div className={Styles.spinner}></div>
      )}
      <img
        src={cardItem.iconLink}
        alt="pic"
        onLoad={() => handleImageLoad(cardItem.position)}
        style={{ display: loadingImages[cardItem.position] ? "none" : "block" }}
        draggable="false"
      />
    </div>
  );
};
export default Card;
