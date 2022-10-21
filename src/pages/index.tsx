import { FunctionComponent } from 'react';
import { Col, Row } from 'antd';
import Simple from './components/simple';
import AsyncTest from './components/async';

const Index: FunctionComponent = () => {
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
};

export default Index;
