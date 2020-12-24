import {
  Table,
  Modal,
  Button,
  Space,
  Select,
  Input,
  Checkbox,
  Typography,
} from "antd";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { CommonEmpDialogStore } from "./CommonEmpDialogStore";
import { useObserver } from "mobx-react";
import { toJS } from "mobx";
import DetailSearchSBData from "./DetailSearchSBData.json";
const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const CommonEmpDialog = () => {
  const { onMountDialog, onMountEmpGrDialog } = CommonEmpDialogStore;
  useEffect(
    () =>
      CommonEmpDialogStore.isEmpGrType ? onMountEmpGrDialog() : onMountDialog(),
    []
  );

  return useObserver(() => (
    <>
      <Modal
        title="사원추가다이얼로그"
        visible={CommonEmpDialogStore.addCommonEmpVisible}
        width={1000}
        footer={[
          <div key="WorkPeriodEditFotter">
            <Button
              key="submit"
              type="primary"
              onClick={CommonEmpDialogStore.handleOk}
            >
              저장
            </Button>

            <Button key="back" onClick={CommonEmpDialogStore.handleCancel}>
              닫기
            </Button>
          </div>,
        ]}
      >
        <Space direction="vertical">
          {CommonEmpDialogStore.isEmpGrType ? (
            <Space direction="vertical">
              <Space>
                <Text>사원그룹구분선택 : </Text>
                <Select
                  style={{ width: 200 }}
                  value={CommonEmpDialogStore.searchEmpGrKind}
                  onSelect={CommonEmpDialogStore.onChangeEgrKind}
                >
                  {CommonEmpDialogStore.empgrfulllist.map((list) => (
                    <Option key={list.EMPGR_KIND} value={list.EMPGR_KIND}>
                      {list.EMPGR_KIND_NM}
                    </Option>
                  ))}
                </Select>
              </Space>
              <Space>
                <Text>사원그룹선택 : </Text>
                <Select
                  style={{ width: 200 }}
                  value={CommonEmpDialogStore.searchEmpGr}
                  onSelect={CommonEmpDialogStore.onChangeEgr}
                  placeholder="사원그룹선택"
                >
                  {CommonEmpDialogStore.empgrSelectedSB.map((list) => (
                    <Option key={list.EMPGR_CD} value={list.EMPGR_CD}>
                      {list.EMPGR_NM}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Space>
          ) : (
            <Space direction="horizontal">
              <Select
                onSelect={CommonEmpDialogStore.onSelectSearchField}
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
                value={CommonEmpDialogStore.searchdata.SEARCH_VALUE}
                onChange={CommonEmpDialogStore.onChangeSearchValue}
                onSearch={CommonEmpDialogStore.detailSearch}
              />

              <Checkbox
                onChange={CommonEmpDialogStore.onChangeCheck}
                checked={CommonEmpDialogStore.isChecked}
              >
                결과내재검색
              </Checkbox>
            </Space>
          )}
          <Space>
            <Table
              key="DispatchAddEmpDialogTable"
              columns={[...CommonEmpDialogStore.columns]}
              rowSelection={{
                type: "checkbox",
                onChange: (selectedRowKeys, selectedRows) => {
                  console.dir(selectedRows);
                  CommonEmpDialogStore.checkedData = selectedRows;
                },
              }}
              dataSource={[...CommonEmpDialogStore.commonTableData]}
            />
          </Space>
        </Space>
      </Modal>
      )
    </>
  ));
};
export default React.memo(CommonEmpDialog);
