import { FunctionComponent } from 'react';

import game, { IItem } from '../game';

interface ItemProps {
  i: string;
}

const Item: FunctionComponent<ItemProps> = (props) => {
  const { i } = props;

  const item = game.useBind<IItem>(['items', i]);

  return (
    <span
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        fontSize: item.height,
        lineHeight: '100%',
        textAlign: 'center',
        verticalAlign: 'baseline',
        fontWeight: 'bold',
        color: item.color,
      }}
    >
      {item.word}
    </span>
  );
};

export default Item;
