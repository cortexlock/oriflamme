import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import './PlayerCard.css';

import useHover from '../../hooks/hover.hook';
import { CardsContext } from '../../context/cards.context';

// const HEIGHT_SCALE = 1.86666667;
const HEIGHT_SCALE = 1.5;

export default function PlayerCard(props) {

  const { canPlayCard, cardColor, cardId, scaleFactor, width } = props;
  const height = width * HEIGHT_SCALE;

  // "METHODS"

  const handleCardClicked = () => {
    if (canPlayCard) {
      setSelected(!selected);
      const value = !selected ? card : null;
      onPlayerCardClicked(value);
    }
  }

  // DYNAMIC STYLES

  const noHoverStyles = {
    card: {
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: cardColor,
    }
  };

  const hoverStyles = {
    card: {
      marginBottom: `${width}px`,
      width: `${width * scaleFactor}px`,
      height: `${height * scaleFactor}px`,
      backgroundColor: cardColor,
    }
  };

  const selectedStyles = {
    card: {
      boxShadow: '0 0 1rem 1rem var(--color-white)',
    }
  };

  const [hoverRef, isHovered] = useHover();
  const [selected, setSelected] = useState(false);
  const [cards, onPlayerCardClicked] = useContext(CardsContext);
  const card = cards[cardId];
  const currentHoverStyle = isHovered ? hoverStyles.card : noHoverStyles.card;
  const currentSelectedStyle = selected ? selectedStyles.card : {};
  const combinedStyle = { ...currentHoverStyle, ...currentSelectedStyle };

  return (
    <div className="player-card">
      <div
        className="player-card__element"
        onClick={() => handleCardClicked(card)}
        ref={hoverRef}
        style={combinedStyle}
      >
        {
          isHovered ?
            <div className="player-card__text">{card.text}</div> :
            null
        }
        <div className="player-card__name">{card.name}</div>
      </div>
    </div>
  );
}

//----------------------------------------------------------------
// PROPS
//----------------------------------------------------------------

const { bool, number, string } = PropTypes;

PlayerCard.propTypes = {
  canPlayCard: bool.isRequired,
  cardColor: string.isRequired,
  cardId: string.isRequired,
  scaleFactor: number,
  width: number,
};

PlayerCard.defaultProps = {
  scaleFactor: 1.5,
  width: 120
};