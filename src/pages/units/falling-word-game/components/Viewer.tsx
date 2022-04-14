import { CSSProperties, FunctionComponent } from 'react';
import { Typography } from 'antd';

import game from '../game';

const Viewer: FunctionComponent<{
  style?: CSSProperties;
}> = (props) => {
  const { style } = props;

  const state = game.useBind();

  return (
    <Typography.Paragraph>
      <pre style={style}>{JSON.stringify(state, undefined, 4)}</pre>
    </Typography.Paragraph>
  );
};

export default Viewer;
