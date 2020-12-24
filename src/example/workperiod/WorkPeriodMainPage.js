import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import {
  Select,
  Space,
  Typography,
  DatePicker,
  Table,
  Button,
  Input,
  Tabs,
  Row,
  Col,
  Menu,
  Dropdown,
  Checkbox,
} from "antd";
import { WorkPeriodMainStore } from "./WorkPeriodMainStore";
import { useObserver } from "mobx-react";
import { toJS } from "mobx";
import WorkPeriodEditDialog from "./WorkPeriodEditDialog";

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const columnPreset = [
  {
    title: "이름",
    dataIndex: "EMP_NM_KOR",
  },
  {
    title: "부서명",
    dataIndex: "ORG_NM",
  },
  {
    title: "사번",
    dataIndex: "EMP_ID",
  },
  {
    title: "직위",
    dataIndex: "POS_NM",
  },
  {
    title: "입사일",
    dataIndex: "EMP_ENTRY_DT",
  },
  {
    title: "근속년월일",
    dataIndex: "TOTAL_WORK_PERIOD",
  },
  {
    title: "총 근속년수",
    dataIndex: "TOTAL_WORK_YEAR",
  },
  {
    title: "총 근속개월수",
    dataIndex: "TOTAL_WORK_MONTH",
  },
  {
    title: "총 근속일수",
    dataIndex: "TOTAL_WORK_DAYS",
  },
  {
    title: "수동조정여부",
    dataIndex: "WORK_PERIOD_ISEDITED",
  },
];
const searchPreset = [
  {
    index: 0,
    title: "column1",
    comp: <Input></Input>,
    isShow: true,
  },
  {
    index: 1,
    title: "column2",
    comp: <DatePicker></DatePicker>,
    isShow: true,
  },
  {
    index: 2,
    title: "column3",
    comp: <Input></Input>,
    isShow: true,
  },
  {
    index: 3,
    title: "column4",
    comp: <DatePicker></DatePicker>,
    isShow: true,
  },
  {
    index: 4,
    title: "column5",
    comp: <Input></Input>,
    isShow: true,
  },
  {
    index: 5,
    title: "column6",
    comp: <Input></Input>,
    isShow: true,
  },
  {
    index: 6,
    title: "column7",
    comp: <Input></Input>,
    isShow: true,
  },
  {
    index: 7,
    title: "column8",
    comp: <Input></Input>,
    isShow: true,
  },
  {
    index: 8,
    title: "column9",
    comp: <Input></Input>,
    isShow: true,
  },
];
const menu = (
  <>
    <Menu>
      <Menu.Item key={0}>
        {searchPreset.slice(0, 3).map((list, index) => (
          <Checkbox
            key={list.index}
            onChange={(e) => WorkPeriodMainStore.checkBoxClick(e, list.index)}
            checked={list.isShow}
          >
            {list.title}
          </Checkbox>
        ))}
      </Menu.Item>
      <Menu.Item key={1}>
        {searchPreset.slice(3, 6).map((list, index) => (
          <Checkbox
            key={list.index}
            onChange={(e) => WorkPeriodMainStore.checkBoxClick(e, list.index)}
            checked={list.isShow}
          >
            {list.title}
          </Checkbox>
        ))}
      </Menu.Item>
      <Menu.Item key={2}>
        {searchPreset.slice(6, 9).map((list, index) => (
          <Checkbox
            key={list.index}
            onChange={(e) => WorkPeriodMainStore.checkBoxClick(e, list.index)}
            checked={list.isShow}
          >
            {list.title}
          </Checkbox>
        ))}
      </Menu.Item>
    </Menu>
    <Button>적용</Button>
    <Button>취소</Button>
  </>
);

const WorkPeriodSearchField = React.memo(() => {
  const cols = [
    searchPreset.map((list) => {
      return (
        <Col key={list.index.toString()} span={8}>
          <Space direction="horizontal">
            <Text>{list.title}</Text>
            {list.comp}
          </Space>
        </Col>
      );
    }),
  ];

  return useObserver(() => (
    <Space direction="vertical">
      <Space>
        <Dropdown overlay={menu} placement="bottomLeft" arrow>
          <Button>filter</Button>
        </Dropdown>
      </Space>
      <Row gutter={[32, 16]}>{cols}</Row>
      <Space align="end">
        <Button>적용</Button>
        <Button>초기화</Button>
      </Space>
    </Space>
  ));
});
const WorkPeriodTableField = React.memo(({ colState }) => {
  const { editModalOpen } = WorkPeriodMainStore;
  return useObserver(() => (
    <Space direction="vertical">
      <Space>
        <Button onClick={editModalOpen}>변경</Button>
        <Button>내보내기</Button>
        <Space></Space>
      </Space>
      <Space>
        <Table
          columns={colState}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              console.dir(selectedRows);
              WorkPeriodMainStore.checkedEmp = selectedRows;
            },
          }}
          onRow={(record) => ({
            onDoubleClick: () => {
              WorkPeriodMainStore.openEditDetail(record);
            },
          })}
          dataSource={WorkPeriodMainStore.workperiodlist}
        />
      </Space>
    </Space>
  ));
});

const WorkPeriodMainPage = () => {
  const [colState, setColState] = useState(columnPreset);
  useEffect(() => WorkPeriodMainStore.onMount(), []);
  return useObserver(() => (
    <>
      <Title style={{ marginTop: 30 }} level={4}>
        근속연수관리
      </Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="근속연수" key="1">
          <WorkPeriodSearchField />
          <WorkPeriodTableField colState={colState} />
          {WorkPeriodMainStore.editModalVisible ? (
            <WorkPeriodEditDialog />
          ) : null}
        </TabPane>
        <TabPane tab="직위연수" key="2">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    </>
  ));
};

export default React.memo(WorkPeriodMainPage);
