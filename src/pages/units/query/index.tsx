import { updateDeep } from 'rx-immer';
import { FunctionComponent, useEffect, useState } from 'react';
import { useRxImmer } from 'rx-immer-react';
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Switch,
  Table,
} from 'antd';

import JSONTextArea from './json-text-area';
import QueryResult from './query-result';
import { uniqueId } from 'lodash';

const DefaultJSON = {
  store: {
    book: [
      {
        category: 'reference',
        author: 'Nigel Rees',
        title: 'Sayings of the Century',
        price: 8.95,
      },
      {
        category: 'fiction',
        author: 'Evelyn Waugh',
        title: 'Sword of Honour',
        price: 12.99,
      },
      {
        category: 'fiction',
        author: 'Herman Melville',
        title: 'Moby Dick',
        isbn: '0-553-21311-3',
        price: 8.99,
      },
      {
        category: 'fiction',
        author: 'J. R. R. Tolkien',
        title: 'The Lord of the Rings',
        isbn: '0-395-19395-8',
        price: 22.99,
      },
    ],
    bicycle: {
      color: 'red',
      price: 19.95,
    },
  },
};

const DefaultQueries = [
  '$.store.book[*].author',
  '$..author',
  '$.store.*',
  '$.store..price',
  '$..book[2]',
  '$..book[(@.length-1)]',
  '$..book[-1:]',
  '$..book[0,1]',
  '$..book[:2]',
  '$..book[0][category,author]',
  '$..book[?(@.isbn)]',
  '$..book[?(@.price<10)]',
  '$..book[?(@.price==8.95)]',
  "$..*[?(@property === 'price' && @ !== 8.95)]",
  '$..book[?(@.price<30 && @.category=="fiction")]',
  '$..[?(@.price>19)]^',
  '$',
  '$..*',
  '$..',
  '$..[?(@.price>19)]^',
  '$.store.*~',
  `$.store.book[?(@path !== "$['store']['book'][0]")]`,
  '$..book[?(@parent.bicycle && @parent.bicycle.color === "red")].category',
  '$..book.*[?(@property !== "category")]',
  '$..book[?(@property !== 0)]',
  '$.store.*[?(@parentProperty !== "book")]',
  '$..book.*[?(@parentProperty !== 0)]',
  '$..book[?(@.price === @root.store.book[2].price)]',
  '$..book..*@number()',
  '$..book.*[?(@property === "category" && @.match(/TION$/i))]',
  '$..book.*[?(@property.match(/bn$/i))]^',
];

export const Query: FunctionComponent = () => {
  const meta = useRxImmer<{ dataSource: any[] }>({ dataSource: [] });
  const store = useRxImmer<any>({});

  const dataSource = meta.useBind('dataSource');

  const [inputQuery, setInputQuery] = useState<string>();
  const [visible, setVisible] = useState(false);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    meta.commit(
      () => DefaultQueries.map((query) => ({ key: uniqueId('query'), query })),
      'dataSource',
    );
  }, []);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const addQuery = () => {
    if (inputQuery) {
      meta.commit((state) => {
        state.dataSource.unshift({ key: uniqueId('query'), query: inputQuery });
      });
      setInputQuery(undefined);
    }
  };

  return (
    <Card>
      <Row gutter={[16, 0]}>
        <Col span={8}>
          <JSONTextArea
            style={{ height: '60vh' }}
            defaultValue={DefaultJSON}
            onChange={(obj) => {
              store.commit((state) => {
                updateDeep(state, obj);
              });
            }}
          />
        </Col>
        <Col span={16}>
          <Space style={{ marginBottom: 16 }}>
            <Button onClick={openModal} type="primary">
              新增
            </Button>
            <Switch checked={editable} onChange={setEditable} />
          </Space>
          <Table
            rowKey="key"
            dataSource={dataSource}
            columns={[
              editable
                ? {
                    dataIndex: 'key',
                    title: '查询',
                    render: (key, record) => (
                      <Input
                        value={record.query}
                        onChange={(event) => {
                          meta.commit((state) => {
                            const item = state.dataSource.find(
                              (item) => item.key === key,
                            );
                            if (item) item.query = event.target.value;
                          });
                        }}
                      />
                    ),
                  }
                : {
                    dataIndex: 'query',
                    title: '查询',
                  },
              {
                dataIndex: 'key',
                title: '结果',
                render: (key, record) => (
                  <QueryResult key={key} store={store} query={record.query} />
                ),
              },
              {
                dataIndex: 'key',
                title: '操作',
                render: (key) => (
                  <Button
                    type="link"
                    onClick={() => {
                      meta.commit((state) => {
                        const index = state.dataSource.findIndex(
                          (item) => item.key === key,
                        );
                        if (index >= 0) state.dataSource.splice(index, 1);
                      });
                    }}
                  >
                    删除
                  </Button>
                ),
              },
            ]}
            pagination={{ defaultPageSize: 5 }}
          />
        </Col>
      </Row>
      <Modal
        title="添加查询"
        open={visible}
        okButtonProps={{ disabled: !inputQuery }}
        onOk={() => {
          addQuery();
          closeModal();
        }}
        onCancel={closeModal}
      >
        <Space>
          查询表达式:
          <Input
            value={inputQuery}
            onChange={(event) => {
              setInputQuery(event.target.value);
            }}
          />
        </Space>
      </Modal>
    </Card>
  );
};

export default Query;
