import Axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Space,
  Table,
  Typography,
  Input,
  DatePicker,
} from "antd";

import { DispatchDetailStore } from "./DispatchDetailStore";
import { useObserver } from "mobx-react";
import columnbasic from "./DispatchColumn/insert_basic_col.json";
import { HR_APP, HR_USER } from "../../GlobalVariables";
import { Link } from "react-router-dom";
import moment from "moment";
import { CommonEmpDialogStore } from "./CommonEmpDialog/CommonEmpDialogStore";
import CommonEmpDialog from "./CommonEmpDialog/CommonEmpDialog";
import { toJS } from "mobx";

const { Title, Text } = Typography;
const { Option } = Select;
const detailCol = [
  {
    key: "org",
    title: "발령부서",
    dataIndex: "ORG_CD_AF_NM",
  },
  {
    key: "duty",
    title: "발령직책",
    dataIndex: "DUTY_CD_AF_NM",
  },
  {
    key: "job",
    title: "발령직무",
    dataIndex: "JOB_CD_AF_NM",
  },
  {
    key: "pos",
    title: "발령직위",
    dataIndex: "POS_CD_AF_NM",
  },
  { title: "퇴직발령", render: () => <b>퇴직</b> },
  {
    title: "휴직발령",
    render: () => <b>휴직</b>,
  },
  {
    title: "복직",
    render: () => <b>복직</b>,
  },
  {
    title: "겸직등록",
    render: () => <b>겸직등록</b>,
  },
  {
    title: "겸직해제",
    render: () => <b>겸직해제</b>,
  },
  {
    title: "복합발령",
    render: () => <b>복합발령</b>,
  },
];
const updateCol = [
  {
    title: "발령부서",
    dataIndex: "ORG_CD_AF",
    render: (id, info, index) => (
      <Select
        key="org"
        placeholder="부서선택"
        allowClear
        defaultValue={
          DispatchDetailStore.dispatchInput.DispatchEmpList[index].ORG_CD_AF
        }
        onSelect={(value) =>
          DispatchDetailStore.onChangeOrgSB(value, info.EMP_ID, index)
        }
      >
        {DispatchDetailStore.orgSBlist.map((list) => (
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
        allowClear
        defaultValue={
          DispatchDetailStore.dispatchInput.DispatchEmpList[index].DUTY_CD_AF
        }
        onChange={(value) =>
          DispatchDetailStore.onChangeDutySB(value, info.EMP_ID, index)
        }
      >
        {DispatchDetailStore.dutySBlist.map((list) => (
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
        allowClear
        defaultValue={
          DispatchDetailStore.dispatchInput.DispatchEmpList[index].JOB_CD_AF
        }
        onChange={(value) =>
          DispatchDetailStore.onChangeJobSB(value, info.EMP_ID, index)
        }
      >
        {DispatchDetailStore.jobSBlist.map((list) => (
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
        allowClear
        defaultValue={
          DispatchDetailStore.dispatchInput.DispatchEmpList[index].POS_CD_AF
        }
        onChange={(value) =>
          DispatchDetailStore.onChangePosSB(value, info.EMP_ID, index)
        }
      >
        {DispatchDetailStore.posSBlist.map((list) => (
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

const DispatchDetailTitle = React.memo(({ changeToUpdate, moveToMainPage }) => {
  console.dir("DispatchDetailTitle");
  const { onClickSave } = DispatchDetailStore;
  return useObserver(() => (
    <>
      <Space direction="vertical">
        <Space>
          <Link to={"/hr/employee/dispatch/dispatchmain"}>
            <Button type="primary" style={{ width: 100 }}>
              발령조회
            </Button>
          </Link>
        </Space>
        <Space>
          {DispatchDetailStore.isread ? (
            <Title level={4}> 인사발령 상세 정보 </Title>
          ) : (
            <Title level={4} style={{ marginTop: 30 }}>
              인사발령수정
            </Title>
          )}
        </Space>
        <Space>
          {DispatchDetailStore.isread ? (
            <Space>
              <Button style={{ width: 100 }} onClick={changeToUpdate}>
                수정
              </Button>
              <Button type="primary" style={{ width: 100 }}>
                상신
              </Button>
            </Space>
          ) : (
            <Space>
              <Button
                type="primary"
                onClick={() => onClickSave(moveToMainPage)}
                style={{ width: 100 }}
              >
                저장
              </Button>
              <Link to={"/hr/employee/dispatch/dispatchmain"}>
                <Button style={{ width: 100 }}>취소</Button>
              </Link>
            </Space>
          )}
        </Space>
      </Space>
    </>
  ));
});

const DispatchDetailInfoField = React.memo(({ onChangeDiskind }) => {
  console.dir("DispatchDetailInfoField");
  const {
    onSelectDisStdt,
    onChangeDisSubject,
    onChangeDisComment,
  } = DispatchDetailStore;
  const onSelectDisKind = (value) => {
    DispatchDetailStore.dispatchInput.DISPATCH_KIND = value;
    DispatchDetailStore.disreaddata.DISPATCH_KIND = value;
    DispatchDetailStore.dispatchInput.DispatchEmpList !== null ||
    DispatchDetailStore.dispatchInput.DispatchEmpList !== undefined
      ? DispatchDetailStore.dispatchInput.DispatchEmpList.map((list) => {
          (list.ORG_CD_AF = ""),
            (list.JOB_CD_AF = ""),
            (list.DUTY_CD_AF = ""),
            (list.POS_CD_AF = "");
        })
      : null;
    console.log(value);
    console.log(toJS(DispatchDetailStore.dispatchInput.DispatchEmpList));
    onChangeDiskind();
  };

  return useObserver(() => (
    <>
      <Space direction="vertical" style={{ marginTop: 30 }}>
        <Space>
          <Text>발령 내용</Text>
        </Space>
        <Space direction="vertical" style={{ marginTop: 10, marginLeft: 40 }}>
          <Space>
            <Text>발령 제목:</Text>
            {DispatchDetailStore.isread ? (
              <Text>{DispatchDetailStore.disreaddata.DISPATCH_SUBJECT}</Text>
            ) : (
              <Input
                name="DISPATCH_SUBJECT"
                value={DispatchDetailStore.dispatchInput.DISPATCH_SUBJECT}
                onChange={onChangeDisSubject}
              />
            )}
          </Space>
          <Space>
            <Text>발령 구분:</Text>
            {DispatchDetailStore.isread ? (
              <Text>{DispatchDetailStore.disreaddata.DISPATCH_KIND_NM}</Text>
            ) : (
              <Select
                name="DISPATCH_KIND"
                placeholder="발령구분선택"
                onSelect={onSelectDisKind}
                defaultValue={DispatchDetailStore.disreaddata.DISPATCH_KIND}
              >
                {DispatchDetailStore.disKindSBList.map((list) => (
                  <Option key={list.DISPATCHSB_CD} value={list.DISPATCHSB_CD}>
                    {list.DISPATCHSB_NM}
                  </Option>
                ))}
              </Select>
            )}
          </Space>
          <Space>
            <Text>발령일:</Text>
            {DispatchDetailStore.isread ? (
              <Text>{DispatchDetailStore.disreaddata.DISPATCH_STDT}</Text>
            ) : (
              <DatePicker
                name="DISPATCH_STDT"
                defaultValue={moment(
                  DispatchDetailStore.dispatchInput.DISPATCH_STDT,
                  "YYYYMMDD"
                )}
                onChange={onSelectDisStdt}
              ></DatePicker>
            )}
          </Space>
          <Space>
            <Text>발령코멘트:</Text>
            {DispatchDetailStore.isread ? (
              <Text>{DispatchDetailStore.disreaddata.DISPATCH_COMMENT}</Text>
            ) : (
              <Input
                name="DISPATCH_COMMENT"
                defaultValue={
                  DispatchDetailStore.dispatchInput.DISPATCH_COMMENT
                }
                onChange={onChangeDisComment}
              />
            )}
          </Space>
          <Space>
            <Text>생 성 자 : </Text>
            <Text>{DispatchDetailStore.disreaddata.CREATOR_NM}</Text>
          </Space>
          <Space>
            <Text>생 성 일 : </Text>
            <Text>{DispatchDetailStore.disreaddata.CREATE_TS}</Text>
          </Space>
        </Space>
      </Space>
    </>
  ));
});
const DispatchDetailTableField = ({ columnstate }) => {
  console.log("DispatchDetailTableField");
  return useObserver(() => (
    <>
      <Space direction="vertical" style={{ marginTop: 30 }}>
        <Space>
          {DispatchDetailStore.isread ? (
            <Text>상세 정보</Text>
          ) : (
            <Text>발령대상</Text>
          )}
        </Space>
        {DispatchDetailStore.isread ? null : (
          <Space style={{ marginTop: 10 }}>
            <Button
              key="add"
              type="primary"
              onClick={DispatchDetailStore.showAddEmpModal}
              style={{ width: 100 }}
            >
              추가
            </Button>
            <Button
              key="add"
              onClick={DispatchDetailStore.showAddEmpGrModal}
              style={{ width: 100 }}
            >
              사원그룹 추가
            </Button>
          </Space>
        )}

        <Space>
          {DispatchDetailStore.isread ? (
            <Table
              columns={[...columnstate]}
              dataSource={DispatchDetailStore.disreaddata.DispatchEmpList}
            />
          ) : (
            <Table
              columns={[...columnstate]}
              rowSelection={{
                type: "checkbox",
                onChange: (selectedRowKeys, selectedRows) => {
                  console.dir(selectedRows);
                  DispatchDetailStore.checkedData = selectedRows;
                },
              }}
              dataSource={[
                ...DispatchDetailStore.dispatchInput.DispatchEmpList,
              ]}
            />
          )}
        </Space>
      </Space>
    </>
  ));
};

const DispatchDetailPageLayout = ({ location, history }) => {
  console.dir("DispatchDetail&UpdatePageLayout");

  const [columnstate, setColumnState] = useState(columnbasic);
  const moveToMainPage = () => {
    history.replace("dispatchmain");
  };

  const onChangeDiskind = () => {
    console.log("onChange");
    let copy = [...columnstate];
    switch (DispatchDetailStore.dispatchInput.DISPATCH_KIND) {
      //0:부서, 1:직책, 2:직무, 3:직위, 4:퇴직, 5:휴직, 6:복직, 7:겸직등록, 8:겸직해제, 9:복합발령
      case "DISORG01":
        DispatchDetailStore.isread
          ? (copy[1].children = [detailCol[0]])
          : (copy[1].children = [updateCol[0]]);
        setColumnState(copy);
        break;
      case "DISDUTY01":
        DispatchDetailStore.isread
          ? (copy[1].children = [detailCol[1]])
          : (copy[1].children = [updateCol[1]]);
        setColumnState(copy);
        break;
      case "DISJOB01":
        DispatchDetailStore.isread
          ? (copy[1].children = [detailCol[2]])
          : (copy[1].children = [updateCol[2]]);
        setColumnState(copy);
        break;
      case "DISPOS01":
        DispatchDetailStore.isread
          ? (copy[1].children = [detailCol[3]])
          : (copy[1].children = [updateCol[3]]);
        setColumnState(copy);
        break;
      case "DISCOMPLEX01":
        DispatchDetailStore.isread
          ? (copy[1].children = [...detailCol.slice(0, 4), detailCol[9]])
          : (copy[1].children = [...updateCol.slice(0, 4), updateCol[9]]);
        setColumnState(copy);
        break;
      case "DISWST01": //퇴직
        copy[1].children = [detailCol[4]];
        setColumnState(copy);
        break;
      case "DISWST02": //휴직
        copy[1].children = [detailCol[5]];
        setColumnState(copy);
        break;
      case "DISWST03":
        DispatchDetailStore.isread
          ? (copy[1].children = [...detailCol.slice(0, 4), detailCol[6]])
          : (copy[1].children = [...updateCol.slice(0, 4), updateCol[6]]);
        setColumnState(copy);
        break;
      case "DISMULTIJOB01":
        DispatchDetailStore.isread
          ? (copy[1].children = [...detailCol.slice(0, 4), detailCol[7]])
          : (copy[1].children = [...updateCol.slice(0, 4), updateCol[7]]);
        setColumnState(copy);
        break;
      case "DISMULTIJOB02":
        copy[1].children = [detailCol[8]];
        setColumnState(copy);
        break;
      default:
        console.log("problem : nothing code match");
    }
  };

  useEffect(
    () =>
      DispatchDetailStore.onMount(
        location.search.split("=")[1],
        onChangeDiskind
      ),
    []
  );

  const changeToUpdate = () => {
    DispatchDetailStore.isread = false;
    onChangeDiskind(DispatchDetailStore.dispatchInput.DISPATCH_KIND);
  };
  return useObserver(() =>
    //로딩중인 경우 return 할 컴포넌트
    DispatchDetailStore.loading ? (
      <div>로딩중...</div>
    ) : //에러발생한 경우 return 할 컴포넌트
    DispatchDetailStore.error ? (
      <div>에러발생</div>
    ) : (
      <>
        <Space direction="vertical">
          <Space>
            <DispatchDetailTitle
              moveToMainPage={moveToMainPage}
              changeToUpdate={changeToUpdate}
            />
          </Space>
          <Space>
            <DispatchDetailInfoField onChangeDiskind={onChangeDiskind} />
          </Space>
          <Space>
            <DispatchDetailTableField columnstate={columnstate} />
          </Space>
        </Space>

        {CommonEmpDialogStore.addCommonEmpVisible ? <CommonEmpDialog /> : null}
      </>
    )
  );
};

export default DispatchDetailPageLayout;
