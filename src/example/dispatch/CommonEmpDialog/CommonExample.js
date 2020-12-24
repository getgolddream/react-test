import { Button, Table } from "antd";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import CommonEmpDialog from "./CommonEmpDialog";
import { CommonExampleStore } from "./CommonExampleStore";
import { CommonEmpDialogStore } from "./CommonEmpDialogStore";
const CommonExample = () => {
  return useObserver(() => (
    <div>
      <Button onClick={CommonExampleStore.showModal}>추가</Button>
      <Button onClick={CommonExampleStore.showEmpGrModal}>사원그룹 추가</Button>
      <Table
        key="CommonExampleTable"
        id="idcheck"
        columns={[
          { id: "name", title: "이름", dataIndex: "EMP_NM_KOR" },
          { id: "empid", title: "사번", dataIndex: "EMP_ID" },
          { id: "org", title: "조직", dataIndex: "ORG_CD_BF_NM" },
          { id: "pos", title: "직위", dataIndex: "POS_CD_BF_NM" },
          { id: "job", title: "직무", dataIndex: "JOB_CD_BF_NM" },
          { id: "duty", title: "직책", dataIndex: "DUTY_CD_BF_NM" },
          {
            id: "workstatus",
            title: "재직상태",
            dataIndex: "DISPATCH_WORKSTATUS_BF_NM",
          },
        ]}
        dataSource={[...CommonExampleStore.tabledata]}
      />
      {CommonEmpDialogStore.addCommonEmpVisible ? <CommonEmpDialog /> : null}
    </div>
  ));
};

export default CommonExample;
