import { Table } from "antd";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { DispatchAddEmpDialogStore } from "./DispatchAddEmpDialogStore";
import { useObserver } from "mobx-react";
import { toJS } from "mobx";

const DispatchAddEmpDialog = () => {
  const { onMountDialog } = DispatchAddEmpDialogStore;
  useEffect(() => onMountDialog(), []);

  return useObserver(() => (
    <Table
      key="DispatchAddEmpDialogTable"
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
          DispatchAddEmpDialogStore.checkedData = selectedRows;
        },
      }}
      dataSource={DispatchAddEmpDialogStore.empAddTableData}
    />
  ));
};
export default React.memo(DispatchAddEmpDialog);
