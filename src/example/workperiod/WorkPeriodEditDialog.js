import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Select,
  Table,
  Input,
  InputNumber,
  Space,
  Typography,
  Form,
} from "antd";
import { useObserver } from "mobx-react";
import { WorkPeriodMainStore } from "./WorkPeriodMainStore";
import { WorkPeriodEditStore } from "./WorkPeriodEditStore";
import { DeleteOutlined } from "@ant-design/icons";
import { HR_APP } from "../../GlobalVariables";
import { toJS } from "mobx";
import Axios from "axios";
import FormItem from "antd/lib/form/FormItem";
const { Text } = Typography;
const { Option } = Select;
const columndetail = [
  {
    title: "증가/감소",
    dataIndex: "WORK_PERIOD_EDIT_KIND_NM",
  },
  {
    title: "년 수",
    dataIndex: "WORK_PERIOD_EDIT_YEARS",
  },
  {
    title: "개월 수",
    dataIndex: "WORK_PERIOD_EDIT_MONTHS",
  },
  {
    title: "일 수",
    dataIndex: "WORK_PERIOD_EDIT_DAYS",
  },
  {
    title: "수정내용",
    dataIndex: "WORK_PERIOD_EDIT_COMMENT",
  },
];
const column = [
  {
    title: "증가/감소",
    render: (id, info, index) => (
      <Select
        placeholder="증/감 선택"
        index={index}
        defaultValue={
          WorkPeriodEditStore.workPeriodEditList[index].WORK_PERIOD_EDIT_KIND
        }
        onChange={(value) =>
          WorkPeriodEditStore.onChangeWorkPeriodEditKind(value, info, index)
        }
      >
        <Option key="PLUS" value="WORK_PERIOD_EDIT_01">
          증가
        </Option>
        <Option key="MINUS" value="WORK_PERIOD_EDIT_02">
          감소
        </Option>
      </Select>
    ),
  },
  {
    title: "년 수",
    render: (id, info, index) => (
      <InputNumber
        name="WORK_PERIOD_EDIT_YEARS"
        index={index}
        onChange={(e) => WorkPeriodEditStore.onChangeYear(e, index)}
        defaultValue={
          WorkPeriodEditStore.workPeriodEditList[index].WORK_PERIOD_EDIT_YEARS
        }
        min={0}
      ></InputNumber>
    ),
  },
  {
    title: "개월 수",
    render: (id, info, index) => (
      <InputNumber
        name="WORK_PERIOD_EDIT_MONTHS"
        index={index}
        onChange={(e) => WorkPeriodEditStore.onChangeMonth(e, index)}
        defaultValue={
          WorkPeriodEditStore.workPeriodEditList[index].WORK_PERIOD_EDIT_MONTHS
        }
      ></InputNumber>
    ),
  },
  {
    title: "일 수",
    render: (id, info, index) => (
      <InputNumber
        name="WORK_PERIOD_EDIT_DAYS"
        index={index}
        onChange={(e) => WorkPeriodEditStore.onChangeDay(e, index)}
        defaultValue={
          WorkPeriodEditStore.workPeriodEditList[index].WORK_PERIOD_EDIT_DAYS
        }
      ></InputNumber>
    ),
  },
  {
    title: "수정내용",
    render: (id, info, index) => (
      <Input
        name="WORK_PERIOD_EDIT_COMMENT"
        index={index}
        onChange={(e) => WorkPeriodEditStore.onChangeComment(e, index)}
        defaultValue={
          WorkPeriodEditStore.workPeriodEditList[index].WORK_PERIOD_EDIT_COMMENT
        }
      ></Input>
    ),
  },
  {
    title: "삭제",
    render: (id, info, index) => (
      <DeleteOutlined
        onClick={(e) => WorkPeriodEditStore.onRowDelete(e, index)}
      />
    ),
  },
];

const WorkPeriodEditDialog = () => {
  const { onMount, addRow, handleOk, handleCancel } = WorkPeriodEditStore;
  useEffect(() => onMount(), []);

  return useObserver(() => (
    <div>
      <Modal
        title="근속년수 수정 다이얼로그"
        visible={WorkPeriodMainStore.editModalVisible}
        width={800}
        footer={[
          <div key="WorkPeriodEditFotter">
            {WorkPeriodEditStore.isUpdate ? (
              <Button key="submit" type="primary" onClick={handleOk}>
                저장
              </Button>
            ) : null}
            <Button key="back" onClick={handleCancel}>
              닫기
            </Button>
          </div>,
        ]}
      >
        <Space direction="vertical">
          <Space>
            <Text>이름</Text>
            <Text>최용석</Text>
          </Space>
          <Space direction="vertical">
            {WorkPeriodEditStore.isUpdate ? null : (
              <Button
                onClick={() => {
                  WorkPeriodEditStore.isUpdate = true;
                }}
              >
                수정
              </Button>
            )}
            {WorkPeriodEditStore.isUpdate ? (
              <Table
                columns={[...column]}
                dataSource={[...WorkPeriodEditStore.workPeriodEditList]}
              />
            ) : (
              <Table
                columns={columndetail}
                dataSource={[...WorkPeriodEditStore.workPeriodEditList]}
              />
            )}
          </Space>
          {WorkPeriodEditStore.isUpdate ? (
            <Button onClick={addRow}>[+]증감항목 추가</Button>
          ) : null}
        </Space>
      </Modal>
    </div>
  ));
};

export default React.memo(WorkPeriodEditDialog);
