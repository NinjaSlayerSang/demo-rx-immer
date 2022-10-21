import { Empty, Space, Typography } from 'antd';
import { FunctionComponent } from 'react';
import { RxImmerReact } from 'rx-immer-react';

const QueryResult: FunctionComponent<{
  store: RxImmerReact<any>;
  query: string;
}> = (props) => {
  const { store, query } = props;

  const result = store.useQuery(query);

  return Array.isArray(result) ? (
    result.length ? (
      <Space direction="vertical" size="small">
        {result.map((v) => (
          <Typography.Paragraph>
            <pre style={{ margin: 0 }}>{JSON.stringify(v, undefined, 2)}</pre>
          </Typography.Paragraph>
        ))}
      </Space>
    ) : (
      <Empty />
    )
  ) : (
    <Typography.Paragraph>
      <pre style={{ margin: 0 }}>{JSON.stringify(result, undefined, 2)}</pre>
    </Typography.Paragraph>
  );
};

export default QueryResult;
