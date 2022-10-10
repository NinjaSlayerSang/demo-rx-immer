import { FunctionComponent, useState } from 'react';
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
    <div
      style={{
        background: '#F5F7FA',
      }}
    >
      <PageContainer
        tabList={[
          { key: 'simple', tab: '简单演示' },
          { key: 'async', tab: '异步更新' },
          { key: 'falling-word-game', tab: '抛字游戏' },
          { key: 'query', tab: '测试查询' },
          { key: 'playground', tab: '综合演示' },
        ]}
        tabActiveKey={tabActiveKey}
        onTabChange={setTabActiveKey}
      >
        {(() => {
          switch (tabActiveKey) {
            case 'simple':
              return <Simple />;
            case 'async':
              return <AsyncTest />;
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
    </div>
  );
};

export default Index;
