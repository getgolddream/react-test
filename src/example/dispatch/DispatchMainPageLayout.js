import React, { useEffect } from "react";
import "antd/dist/antd.css";
import {
  Select,
  Space,
  Typography,
  DatePicker,
  Table,
  Button,
  Popconfirm,
  message,
} from "antd";
import { DispatchMainStore } from "./DispatchMainStore";
import { useObserver } from "mobx-react";
import { toJS } from "mobx";
import main_col from "../dispatch/DispatchColumn/main_col.json";
const { Option } = Select;
const { Title, Text } = Typography;
import { Link } from "react-router-dom";

const DispatchMainTitle = React.memo(() => {
  console.dir("DispatchTitle");
  return (
    <>
      <Link to={"/hr/employee/dispatch/dispatchinsert"}>
        <Button type="primary" style={{ width: 100 }}>
          발령등록
        </Button>
      </Link>
      <br />
      <Title style={{ marginTop: 30 }} level={4}>
        발령조회
      </Title>
      <Text> 발령내역을 조회하는 페이지 입니다. </Text>
    </>
  );
});

const DispatchMainInputField = React.memo(() => {
  const {
    onDiskindChoice,
    onApprChoice,
    onStdtChoice,
    onEddtChoice,
    onClickSearch,
  } = DispatchMainStore;
  console.dir("DispatchInputField");
  return (
    <div style={{ marginTop: 30, width: 1600 }}>
      <Space direction="vertical">
        <Space>
          <Text>발령구분:</Text>
          <Select
            name="DISPATCH_KIND"
            placeholder="발령구분선택"
            onSelect={onDiskindChoice}
          >
            {DispatchMainStore.disKindSBList.map((list) => (
              <Option key={list.DISPATCHSB_CD} value={list.DISPATCHSB_CD}>
                {list.DISPATCHSB_NM}
              </Option>
            ))}
          </Select>
        </Space>
        <Space>
          <Text>승인상태:</Text>
          <Select
            name="DISPATCH_APPR_STATUS"
            placeholder="승인상태선택"
            onSelect={onApprChoice}
          >
            {DispatchMainStore.disApprSBList.map((list) => (
              <Option key={list.DISPATCHSB_CD} value={list.DISPATCHSB_CD}>
                {list.DISPATCHSB_NM}
              </Option>
            ))}
          </Select>
        </Space>
        <Space>
          <Text>조회 시작일:</Text>
          <DatePicker name="SEARCH_STDT" onChange={onStdtChoice}></DatePicker>
          <Text>조회 종료일:</Text>
          <DatePicker name="SEARCH_EDDT" onChange={onEddtChoice}></DatePicker>
          <Button type="primary" style={{ width: 100 }} onClick={onClickSearch}>
            조회
          </Button>
        </Space>
      </Space>
    </div>
  );
});

const DispatchMainTableField = React.memo(({ linkToDetailPage }) => {
  const { onClickDelete } = DispatchMainStore;

  return useObserver(() => (
    <div style={{ marginTop: 30, width: 1600 }}>
      <Space direction="vertical">
        <Popconfirm
          placement="topLeft"
          title="정말 삭제하시겠습니까?"
          onConfirm={onClickDelete}
          okText="네"
          cancelText="아니오"
        >
          <Button type="primary" style={{ width: 100 }}>
            삭제
          </Button>
        </Popconfirm>
        <Table
          columns={main_col}
          onRow={(record) => ({
            onDoubleClick: () => {
              linkToDetailPage(record.key);
            },
          })}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              console.dir(selectedRows);
              DispatchMainStore.checkedData = selectedRows;
            },
          }}
          dataSource={DispatchMainStore.disTableData}
        />
      </Space>
    </div>
  ));
});

const DispatchMainPageLayout = ({ history }) => {
  console.dir("DispatchMainPageLayout");
  const { onMount } = DispatchMainStore;
  //마운트 시에
  useEffect(() => onMount(), []);
  const linkToDetailPage = (key) => {
    console.dir("linkTo" + key);
    console.dir(history);
    history.replace("dispatchdetail?disid=" + key);
  };
  return useObserver(() =>
    //로딩중인 경우 return 할 컴포넌트
    DispatchMainStore.loading ? (
      <div>로딩중...</div>
    ) : //에러발생한 경우 return 할 컴포넌트
    DispatchMainStore.error ? (
      <div>에러발생</div>
    ) : (
      <>
        <DispatchMainTitle />
        <br />
        <DispatchMainInputField />
        <br />
        <DispatchMainTableField linkToDetailPage={linkToDetailPage} />
      </>
    )
  );
};

export default React.memo(DispatchMainPageLayout);
