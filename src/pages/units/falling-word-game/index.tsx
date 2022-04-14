import { FunctionComponent, useState } from 'react';
import { Button, Card, Col, InputNumber, Row, Space } from 'antd';
import { LoadingOutlined, VideoCameraOutlined } from '@ant-design/icons';

import game, { IGame, params, itemStyle, start, stop, clear } from './game';
import Viewer from './components/viewer';
import Screen from './components/Screen';

const FallingWordGame: FunctionComponent = () => {
  const status = game.useBind<IGame['status']>('status');
  const running = status === 'running';

  const [i, setI] = params.useTwoWayBind<number>('i');
  const [a, setA] = params.useTwoWayBind<number>('a');
  const [cor, setCor] = params.useTwoWayBind<number>('cor');
  const [cof, setCof] = params.useTwoWayBind<number>('cof');
  const [size, setSize] = itemStyle.useTwoWayBind<number>('size');

  const [visible, setVisible] = useState(false);

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
                  setVisible((v) => !v);
                }}
              >
                {visible ? '隐藏数据' : '展示数据'}
              </Button>
            }
          >
            <Space size="large" wrap>
              <Space>
                帧间隔:
                <InputNumber
                  value={i}
                  onChange={setI}
                  min={10}
                  disabled={running}
                />
              </Space>
              <Space>
                加速度:
                <InputNumber value={a} onChange={setA} />
              </Space>
              <Space>
                反弹系数:
                <InputNumber
                  value={cor}
                  onChange={setCor}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </Space>
              <Space>
                摩擦系数:
                <InputNumber
                  value={cof}
                  onChange={setCof}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </Space>
              <Space>
                字大小:
                <InputNumber
                  value={size}
                  onChange={setSize}
                  min={16}
                  max={128}
                />
              </Space>
            </Space>
            {visible && (
              <Viewer
                style={{ height: 'calc(70vh - 210px)', overflowY: 'scroll' }}
              />
            )}
          </Card>
        </Col>
        <Col span={18}>
          <Screen />
        </Col>
      </Row>
    </Card>
  );
};

export default FallingWordGame;
