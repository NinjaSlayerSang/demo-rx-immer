import { FunctionComponent, useState } from 'react';
import { Button, Card, Col, Drawer, InputNumber, Row, Space } from 'antd';
import { LoadingOutlined, VideoCameraOutlined } from '@ant-design/icons';

import game, { IGame, params, itemStyle, start, stop, clear } from './game';
import Viewer from './components/viewer';
import Screen from './components/screen';

const omitNil = (f: (v: number) => void) => (value?: number | null) => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    f(value);
  }
};

const FallingWordGame: FunctionComponent = () => {
  const status = game.useBind<IGame['status']>('status');
  const running = status === 'running';

  const [i, setI] = params.useTwoWayBind<number>('i');
  const [a, setA] = params.useTwoWayBind<number>('a');
  const [cor, setCor] = params.useTwoWayBind<number>('cor');
  const [cof, setCof] = params.useTwoWayBind<number>('cof');
  const [size, setSize] = itemStyle.useTwoWayBind<number>('size');

  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const settings = (
    <Space size="large" direction="vertical">
      <Space>
        帧间隔:
        <InputNumber
          value={i}
          onChange={omitNil(setI)}
          min={10}
          disabled={running}
        />
      </Space>
      <Space>
        加速度:
        <InputNumber value={a} onChange={omitNil(setA)} />
      </Space>
      <Space>
        反弹系数:
        <InputNumber
          value={cor}
          onChange={omitNil(setCor)}
          min={0}
          max={1}
          step={0.01}
        />
      </Space>
      <Space>
        摩擦系数:
        <InputNumber
          value={cof}
          onChange={omitNil(setCof)}
          min={0}
          max={1}
          step={0.01}
        />
      </Space>
      <Space>
        字大小:
        <InputNumber
          value={size}
          onChange={omitNil(setSize)}
          min={16}
          max={128}
        />
      </Space>
    </Space>
  );

  return (
    <Card
      title="抛字游戏"
      extra={
        <Space>
          <Button
            type="primary"
            icon={running ? <LoadingOutlined /> : <VideoCameraOutlined />}
            onClick={() => {
              if (running) {
                stop();
              } else {
                start();
              }
            }}
            danger={running}
          >
            {running ? '停止' : '开始'}
          </Button>
          <Button onClick={clear}>清空</Button>
        </Space>
      }
    >
      <Row gutter={32}>
        <Col span={6}>
          <Card
            title="设置"
            size="small"
            extra={
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setVisible(true);
                }}
              >
                状态面板
              </Button>
            }
          >
            {settings}
          </Card>
        </Col>
        <Col span={18}>
          <Screen />
        </Col>
      </Row>
      <Drawer
        title="状态数据"
        extra={
          <Button
            onClick={() => {
              setShowSettings((s) => !s);
            }}
          >
            {showSettings ? '收起设置' : '显示设置'}
          </Button>
        }
        placement="left"
        width="26vw"
        open={visible}
        onClose={() => {
          setVisible(false);
        }}
        mask={false}
      >
        {showSettings && <Card size="small">{settings}</Card>}
        <Viewer />
      </Drawer>
    </Card>
  );
};

export default FallingWordGame;
