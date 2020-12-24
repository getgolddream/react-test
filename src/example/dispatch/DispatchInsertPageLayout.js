import {
  Space,
  Input,
  DatePicker,
  Typography,
  Button,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { DispatchInsertStore } from "./DispatchInsertStore";
import { useObserver } from "mobx-react";
import { toJS } from "mobx";
import { Route, Link } from "react-router-dom";
import columnbasic from "./DispatchColumn/insert_basic_col.json";
import { HR_USER } from "../../GlobalVariables";
import { CommonEmpDialogStore } from "./CommonEmpDialog/CommonEmpDialogStore";
import CommonEmpDialog from "./CommonEmpDialog/CommonEmpDialog";
const { Title, Text } = Typography;
const { Option } = Select;

const columnPreset = [
  {
    title: "발령부서",
    dataIndex: "ORG_CD_AF",
    render: (id, info, index) => (
      <Select
        key="org"
        placeholder="부서선택"
        allowClear
        style={{ width: 100 }}
        onChange={(value) =>
          DispatchInsertStore.onChangeOrgSB(value, info.EMP_ID, index)
        }
      >
        {DispatchInsertStore.orgSBlist.map((list) => (
          <Option key={list.DISPATCHSB_CD} value={list.DISPATCHSB_CD}>
            {list.DISPATCHSB_NM}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    title: "발령직책",
    dataIndex: "DUTY_CD_AF",
    render: (id, info, index) => (
      <Select
        key="duty"
        placeholder="직책선택"
        style={{ width: 100 }}
        allowClear
        onChange={(value) =>
          DispatchInsertStore.onChangeDutySB(value, info.EMP_ID, index)
        }
      >
        {DispatchInsertStore.dutySBlist.map((list) => (
          <Option key={list.DISPATCHSB_CD} value={list.DISPATCHSB_CD}>
            {list.DISPATCHSB_NM}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    title: "발령직무",
    dataIndex: "JOB_CD_AF",
    render: (id, info, index) => (
      <Select
        placeholder="직무선택"
        style={{ width: 100 }}
        allowClear
        onChange={(value) =>
          DispatchInsertStore.onChangeJobSB(value, info.EMP_ID, index)
        }
      >
        {DispatchInsertStore.jobSBlist.map((list) => (
          <Option key={list.DISPATCHSB_CD} value={list.DISPATCHSB_CD}>
            {list.DISPATCHSB_NM}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    title: "발령직위",
    dataIndex: "POS_CD_AF",
    render: (id, info, index) => (
      <Select
        key="pos"
        placeholder="직위선택"
        style={{ width: 100 }}
        allowClear
        onChange={(value) =>
          DispatchInsertStore.onChangePosSB(value, info.EMP_ID, index)
        }
      >
        {DispatchInsertStore.posSBlist.map((list) => (
          <Option key={list.DISPATCHSB_CD} value={list.DISPATCHSB_CD}>
            {list.DISPATCHSB_NM}
          </Option>
        ))}
      </Select>
    ),
  },
  { title: "퇴직발령", render: () => <b>퇴직</b> },
  { title: "휴직발령", render: () => <b>휴직</b> },
  { title: "복직", render: () => <b>복직</b> },
  { title: "겸직등록", render: () => <b>겸직등록</b> },
  { title: "겸직해제", render: () => <b>겸직해제</b> },
  { title: "복합발령", render: () => <b>복합발령</b> },
];

const DispatchInsertTitle = React.memo(({ moveToMainPage }) => {
  console.dir("DispatchInsertTitle");
  const { onClickSave } = DispatchInsertStore;
  return (
    <>
      <Space direction="vertical">
        <Link to={"/hr/employee/dispatch/dispatchmain"}>
          <Button type="primary" style={{ width: 100 }}>
            발령조회
          </Button>
        </Link>
        <Title level={4} style={{ marginTop: 30 }}>
          인사발령등록
        </Title>
        <Space>
          <Button
            type="primary"
            onClick={() => onClickSave(moveToMainPage)}
            style={{ width: 100 }}
          >
            등록
          </Button>
          <Link to={"/hr/employee/dispatch/dispatchmain"}>
            <Button style={{ width: 100 }}>취소</Button>
          </Link>
        </Space>
      </Space>
    </>
  );
});
const DispatchInsertInputField = React.memo(
  ({ columnstate, setColumnState }) => {
    console.dir("DispatchInsertInput");
    const {
      onSelectDisStdt,
      onChangeDisSubject,
      onChangeDisComment,
    } = DispatchInsertStore;
    const onSelectDiskind = (value) => {
      console.log(value);
      const copy = [...columnstate];
      switch (value) {
        //0:부서, 1:직책, 2:직무, 3:직위, 4:퇴직, 5:휴직, 6:복직, 7:겸직등록, 8:겸직해제, 9:복합발령
        case "DISORG01":
          copy[1].children = [columnPreset[0]];
          setColumnState(copy);
          break;
        case "DISDUTY01":
          copy[1].children = [columnPreset[1]];
          setColumnState(copy);
          break;
        case "DISJOB01":
          copy[1].children = [columnPreset[2]];
          setColumnState(copy);
          break;
        case "DISPOS01":
          copy[1].children = [columnPreset[3]];
          setColumnState(copy);
          break;
        case "DISCOMPLEX01":
          copy[1].children = [...columnPreset.slice(0, 4), columnPreset[9]];
          setColumnState(copy);
          break;
        case "DISWST01": //퇴직
          copy[1].children = [columnPreset[4]];
          setColumnState(copy);
          break;
        case "DISWST02": //휴직
          copy[1].children = [columnPreset[5]];
          setColumnState(copy);
          break;
        case "DISWST03":
          copy[1].children = [...columnPreset.slice(0, 4), columnPreset[6]];
          setColumnState(copy);
          break;
        case "DISMULTIJOB01":
          copy[1].children = [...columnPreset.slice(0, 4), columnPreset[7]];
          setColumnState(copy);
          break;
        case "DISMULTIJOB02":
          copy[1].children = [columnPreset[8]];
          setColumnState(copy);
          break;
        default:
          alert("problem : nothing code match");
      }
      DispatchInsertStore.dispatchInput.DISPATCH_KIND = value;
      DispatchInsertStore.dispatchInput.DispatchEmpList = [];
    };

    return useObserver(() => (
      <Space direction="vertical" style={{ marginTop: 30 }}>
        <Space>
          <Text>발령내용</Text>
        </Space>
        <Space direction="vertical" style={{ marginTop: 10, marginLeft: 40 }}>
          <Space>
            <Text>발령제목:</Text>
            <Input name="DISPATCH_SUBJECT" onChange={onChangeDisSubject} />
          </Space>
          <Space>
            <Text>발령구분:</Text>
            <Select
              name="DISPATCH_KIND"
              placeholder="발령구분선택"
              onSelect={onSelectDiskind}
            >
              {DispatchInsertStore.disKindSBList.map((list) => (
                <Option key={list.DISPATCHSB_CD} value={list.DISPATCHSB_CD}>
                  {list.DISPATCHSB_NM}
                </Option>
              ))}
            </Select>
          </Space>

          <Space>
            <Text>발령일:</Text>
            <DatePicker
              name="DISPATCH_STDT"
              onChange={onSelectDisStdt}
            ></DatePicker>
          </Space>
          <Space>
            <Text>비고:</Text>
            <Input name="DISPATCH_COMMENT" onChange={onChangeDisComment} />
          </Space>
        </Space>
      </Space>
    ));
  }
);
const DispatchInsertTableField = ({ columnstate }) => {
  return useObserver(() => (
    <Space direction="vertical" style={{ marginTop: 30 }}>
      <Space>
        <Text>발령대상</Text>
      </Space>
      <Space style={{ marginTop: 10 }}>
        <Button
          key="add"
          type="primary"
          onClick={DispatchInsertStore.showAddEmpModal}
          style={{ width: 100 }}
        >
          추가
        </Button>
        <Button
          key="add"
          onClick={DispatchInsertStore.showAddEmpGrModal}
          style={{ width: 100 }}
        >
          사원그룹 추가
        </Button>
      </Space>
      <Space>
        <Table
          columns={[...columnstate]}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              console.dir(selectedRows);
              DispatchInsertStore.checkedData = selectedRows;
            },
          }}
          dataSource={[...DispatchInsertStore.dispatchInput.DispatchEmpList]}
        />
      </Space>
    </Space>
  ));
};

const DispatchInsertPageLayout = ({ history }) => {
  console.dir("DispatchInsertPageLayout");
  const moveToMainPage = () => {
    console.dir(history);
    history.replace("dispatchmain");
  };
  const [columnstate, setColumnState] = useState(columnbasic);
  //마운트 시에
  useEffect(() => DispatchInsertStore.onMount(), []);
  return useObserver(() =>
    //로딩중인 경우 return 할 컴포넌트
    DispatchInsertStore.loading ? (
      <div>로딩중...</div>
    ) : //에러발생한 경우 return 할 컴포넌트
    DispatchInsertStore.error ? (
      <div>에러발생</div>
    ) : (
      <Space direction="vertical">
        <Space>
          <DispatchInsertTitle moveToMainPage={moveToMainPage} />
        </Space>
        <Space>
          <DispatchInsertInputField
            columnstate={columnstate}
            setColumnState={setColumnState}
          />
        </Space>
        <Space>
          <DispatchInsertTableField
            setColumnState={setColumnState}
            columnstate={columnstate}
          />
        </Space>
        {CommonEmpDialogStore.addCommonEmpVisible ? <CommonEmpDialog /> : null}
      </Space>
    )
  );
};

export default DispatchInsertPageLayout;
