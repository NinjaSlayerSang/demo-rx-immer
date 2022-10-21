import { Path } from 'rx-immer';
import { FunctionComponent, useState } from 'react';
import { RxImmerReact, useRxImmer } from 'rx-immer-react';
import { Card, Input, Space, Tag, Typography } from 'antd';

const Edit: FunctionComponent<{
  store: RxImmerReact;
  path: Path;
}> = (props) => {
  const { store, path } = props;

  const [value, setValue] = store.useTwoWayBind(path);

  return (
    <Input
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
    />
  );
};

const View: FunctionComponent<{
  store: RxImmerReact;
  space?: string | number;
}> = (props) => {
  const { store, space } = props;
  const state = store.useBind();

  return (
    <Typography.Paragraph>
      <pre>{JSON.stringify(state, undefined, space)}</pre>
    </Typography.Paragraph>
  );
};

const Simple: FunctionComponent = () => {
  const store = useRxImmer<any>({ a: [{ b: { c: 'test' } }, 1, 'abc', {}] });

  const [path, setPath] = useState('a[0].b.c');
  const value = store.useBind(path);

  return (
    <Card
      title={
        <Space>
          数据:<Tag>{`${value}`}</Tag>
        </Space>
      }
    >
      <Space direction="vertical">
        <Space>
          路径:
          <Input
            value={path}
            onChange={(event) => {
              setPath(event.target.value);
            }}
          />
        </Space>
        <Space>
          编辑:
          <Edit store={store} path={path} />
        </Space>
        <View store={store} space={4} />
      </Space>
    </Card>
  );
};

export default Simple;
