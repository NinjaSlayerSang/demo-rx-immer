import { FunctionComponent, useState } from 'react';
import { Col, Row } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import 'antd/dist/antd.less';
import Simple from './units/simple';
import AsyncTest from './units/async';
import Playground from './playground';
import FallingWordGame from './units/falling-word-game';
import Query from './units/query';

const Index: FunctionComponent = () => {
  const [tabActiveKey, setTabActiveKey] = useState('simple');

  return (
    <PageContainer
      tabList={[
        { key: 'simple', tab: '基础演示' },
        { key: 'playground', tab: '综合演示' },
        { key: 'query', tab: '查询演示' },
        { key: 'falling-word-game', tab: '抛字游戏' },
      ]}
      tabActiveKey={tabActiveKey}
      onTabChange={setTabActiveKey}
    >
      {(() => {
        switch (tabActiveKey) {
          case 'simple':
            return (
              <Row gutter={24}>
                <Col>
                  <Simple />
                </Col>
                <Col>
                  <AsyncTest />
                </Col>
              </Row>
            );
          case 'playground':
            return <Playground />;
          case 'falling-word-game':
            return <FallingWordGame />;
          case 'query':
            return <Query />;
          default:
            return null;
        }
      })()}
    </PageContainer>
  );
};

export default Index;
