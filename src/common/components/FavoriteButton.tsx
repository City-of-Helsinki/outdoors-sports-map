import {
  Button,
  ButtonSize,
  ButtonVariant,
  IconStar,
  IconStarFill,
} from "hds-react";

type Props = {
  addFavoriteText: string;
  removeFavoriteText: string;
  isFavorite?: boolean;
  onClick: () => void;
};

function FavoriteButton({
  addFavoriteText,
  isFavorite,
  onClick,
  removeFavoriteText,
}: Readonly<Props>) {
  return (
    <Button
      className="favorite-button"
      data-testid={"favorite-button"}
      size={ButtonSize.Small}
      iconEnd={
        isFavorite ? (
          <IconStarFill data-testid="star-fill-icon" />
        ) : (
          <IconStar data-testid="star-icon" />
        )
      }
      onClick={onClick}
      variant={ButtonVariant.Supplementary}
      fullWidth
    >
      {isFavorite ? removeFavoriteText : addFavoriteText}
    </Button>
  );
}

export default FavoriteButton;
