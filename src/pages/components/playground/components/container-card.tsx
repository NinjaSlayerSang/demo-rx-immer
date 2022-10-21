import {
  FunctionComponent,
  MutableRefObject,
  ReactNode,
  useState,
} from 'react';
import { Diachrony } from 'rx-immer';
import { Button, Card, Input, InputNumber, Space } from 'antd';
import { LoadingOutlined, VideoCameraOutlined } from '@ant-design/icons';
import type { PropsWithStore, ReplayActions, Store } from '..';

interface ContainerCardProps {
  replayRef: MutableRefObject<ReplayActions | undefined>;
  children?: ReactNode;
}

const ContainerCard: FunctionComponent<ContainerCardProps & PropsWithStore> = (
  props,
) => {
  const { store, replayRef, children } = props;

  const title = store.useBind<string | undefined>(['title']);
  const count = store.useBind<number>(['count']);

  const [undos, redos] = store.useRoamStatus?.() ?? [0, 0];

  const [recording, setRecording] = useState(false);
  const [diachrony, setDiachrony] = useState<Diachrony<Store>>();

  return (
    <Card
      title={title}
      extra={
        <Space>
          <Button
            type="primary"
            size="middle"
            danger
            onClick={() => {
              store.revert?.();
            }}
            disabled={!undos}
          >
            回滚{!!undos && `(${undos})`}
          </Button>
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              store.recover?.();
            }}
            disabled={!redos}
          >
            恢复{!!redos && `(${redos})`}
          </Button>
        </Space>
      }
      actions={[
        <Space>
          标题:
          <Input
            value={title}
            onChange={(event) => {
              store.commit((draft) => {
                draft.title = event.target.value;
              });
            }}
          />
        </Space>,
        <Space>
          列表最大长度:
          <InputNumber
            value={count}
            onChange={(value) => {
              store.commit((draft) => {
                draft.count = value ?? 0;
              });
            }}
          />
        </Space>,
        <Space>
          <Button
            type="primary"
            icon={recording ? <LoadingOutlined /> : <VideoCameraOutlined />}
            onClick={() => {
              const result = store.archive?.();
              setDiachrony(recording ? result : undefined);
              setRecording((r) => !r);
            }}
            danger={recording}
          >
            {recording ? '停止' : '记录'}
          </Button>
          <Button
            onClick={() => {
              if (diachrony) {
                console.log('归档数据:', diachrony);
                replayRef.current?.open(diachrony);
              }
            }}
            disabled={!diachrony}
          >
            重播
          </Button>
        </Space>,
      ]}
    >
      {children}
    </Card>
  );
};

export default ContainerCard;
