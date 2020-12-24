import { Button, Table } from "antd";
import Axios from "axios";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import EmpGrMemberAddDialog from "./EmpGrMemberAddDialog";
import { HR_APP, HR_USER } from "../../GlobalVariables";
const columns = [
  {
    title: "사번",
    dataIndex: "EMP_ID",
  },
  {
    title: "성명",
    dataIndex: "EMP_NM_KOR",
  },
  {
    title: "사원그룹명",
    dataIndex: "EMPGR_NM",
  },
  {
    title: "조직",
    dataIndex: "ORG_CD_AF_NM",
  },
  {
    title: "직위",
    dataIndex: "POS_CD_AF_NM",
  },
  {
    title: "직무",
    dataIndex: "JOB_CD_AF_NM",
  },
  {
    title: "직책",
    dataIndex: "DUTY_CD_AF_NM",
  },
  {
    title: "재직상태",
    dataIndex: "DISPATCH_WORKSTATUS_AF_NM",
  },
];
const EmpGrTableReducer = (state, action) => {
  const { type, ...rest } = action;
  switch (type) {
    case "SET_STATE":
      return { ...state, ...rest };
    default:
      return state;
  }
};
const EmpGrMainTableLayout = ({ selectedData, onFullMount }) => {
  const [tableState, EmpGrTableDispatch] = useReducer(EmpGrTableReducer, {
    egrTableData: [],
    addEmpVisible: false,
    checkData: [],
  });
  const { egrTableData, addEmpVisible, checkData } = tableState;
  const onMount = async () => {
    EmpGrTableDispatch({
      type: "SET_STATE",
      egrTableData: selectedData.EmpGroupEmpList,
    });
  };
  useEffect(() => {
    onMount();
  }, [selectedData]);

  const showAddEmpModal = () => {
    EmpGrTableDispatch({
      type: "SET_STATE",
      addEmpVisible: true,
    });
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      EmpGrTableDispatch({
        type: "SET_STATE",
        checkData: selectedRows,
      });
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  const deleteEmpgrMember = async () => {
    try {
      const result = await Axios.post(
        `${HR_APP}/Employee/DeleteEmpGroupEmpList?action=SO`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          dto: {
            EmpGroupEmpList: checkData,
          },
        }
      );

      var templist = egrTableData;
      checkData.map((data) =>
        templist.splice(
          templist.findIndex((list) => list.EMP_ID === data.EMP_ID),
          1
        )
      );
      EmpGrTableDispatch({
        type: "SET_STATE",
        egrTableData: [...templist],
      });
      onFullMount();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="EmpGroupEmpTable">
      <Button type="primary" onClick={showAddEmpModal}>
        추가
      </Button>
      <Button type="primary" onClick={deleteEmpgrMember}>
        삭제
      </Button>
      {addEmpVisible ? (
        <EmpGrMemberAddDialog
          tableState={tableState}
          EmpGrTableDispatch={EmpGrTableDispatch}
          selectedData={selectedData}
          onFullMount={onFullMount}
        />
      ) : null}
      <Table
        columns={columns}
        rowSelection={{ ...rowSelection }}
        dataSource={egrTableData}
      />
    </div>
  );
};

export default EmpGrMainTableLayout;
