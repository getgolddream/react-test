import { Table, Modal, Button, Space, Select, Input, Checkbox } from "antd";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { EmpGrAddMemberStore } from "./EmpGrAddMemberStore";
import { useObserver } from "mobx-react";
import { toJS } from "mobx";
import DetailSearchSBData from "./DetailSearchSBData.json";
const { Option } = Select;
const { Search } = Input;
const EmpGrAddMemberDialog = () => {
  useEffect(() => EmpGrAddMemberStore.onMountDialog(), []);

  return useObserver(() => (
    <>
      <Modal
        title="사원추가다이얼로그"
        visible={EmpGrAddMemberStore.addCommonEmpVisible}
        width={1000}
        footer={[
          <div key="WorkPeriodEditFotter">
            <Button
              key="submit"
              type="primary"
              onClick={EmpGrAddMemberStore.handleOk}
            >
              저장
            </Button>

            <Button key="back" onClick={EmpGrAddMemberStore.handleCancel}>
              닫기
            </Button>
          </div>,
        ]}
      >
        <Space direction="vertical">
          <Space direction="horizontal">
            <Select
              onSelect={EmpGrAddMemberStore.onSelectSearchField}
              style={{ width: 100 }}
            >
              {DetailSearchSBData.map((list) => (
                <Option key={list.SEARCHFIELD_CD} value={list.SEARCHFIELD_CD}>
                  {list.SEARCHFIELD_NM}
                </Option>
              ))}
            </Select>
            <Search
              enterButton="조회"
              style={{ width: 200 }}
              value={EmpGrAddMemberStore.searchdata.SEARCH_VALUE}
              onChange={EmpGrAddMemberStore.onChangeSearchValue}
              onSearch={EmpGrAddMemberStore.detailSearch}
            />

            <Checkbox
              onChange={EmpGrAddMemberStore.onChangeCheck}
              checked={EmpGrAddMemberStore.isChecked}
            >
              결과내재검색
            </Checkbox>
          </Space>
          <Space>
            <Table
              key="EmpGrAddMemberDialogTable"
              columns={[
                { id: "name", title: "이름", dataIndex: "EMP_NM_KOR" },
                { id: "empid", title: "사번", dataIndex: "EMP_ID" },
                { id: "org", title: "조직", dataIndex: "ORG_CD_AF_NM" },
                { id: "pos", title: "직위", dataIndex: "POS_CD_AF_NM" },
                { id: "job", title: "직무", dataIndex: "JOB_CD_AF_NM" },
                { id: "duty", title: "직책", dataIndex: "DUTY_CD_AF_NM" },
                {
                  id: "workstatus",
                  title: "재직상태",
                  dataIndex: "DISPATCH_WORKSTATUS_AF_NM",
                },
              ]}
              rowSelection={{
                type: "checkbox",
                onChange: (selectedRowKeys, selectedRows) => {
                  console.dir(selectedRows);
                  EmpGrAddMemberStore.checkedData = selectedRows;
                },
              }}
              dataSource={[...EmpGrAddMemberStore.commonTableData]}
            />
          </Space>
        </Space>
      </Modal>
      )
    </>
  ));
};
export default React.memo(EmpGrAddMemberDialog);
