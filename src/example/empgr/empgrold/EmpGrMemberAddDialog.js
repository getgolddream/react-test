import { Button, Table } from "antd";
import Modal from "antd/lib/modal/Modal";
import Axios from "axios";
import "antd/dist/antd.css";
import { HR_APP, HR_USER } from "../../GlobalVariables";
import React, { useCallback, useEffect, useReducer, useState } from "react";

const columns = [
  {
    title: "이름",
    dataIndex: "EMP_NM_KOR",
  },
  {
    title: "사번",
    dataIndex: "EMP_ID",
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
const EmpGrAddEmpReducer = (state, action) => {
  const { type, ...rest } = action;
  switch (type) {
    case "SET_STATE":
      return { ...state, ...rest };
    default:
      return state;
  }
};

const EmpGrMemberAddDialog = ({
  tableState,
  selectedData,
  onFullMount,
  EmpGrTableDispatch,
}) => {
  const [state, EmpGrAddEmpDispatch] = useReducer(EmpGrAddEmpReducer, {
    empAddTableData: [],
    checkData: [],
    modalText: "Content of the modal",
    confirmLoading: false,
  });
  const { egrTableData, addEmpVisible } = tableState;
  const { empAddTableData, checkData, modalText, confirmLoading } = state;
  const onMount = async () => {
    const result = await Axios.get(
      `${HR_APP}/Employee/ReadDispatchNow?action=SO`
    );
    console.log(result);
    EmpGrAddEmpDispatch({
      type: "SET_STATE",
      empAddTableData: result.data.dto.DispatchEmpNowList.map((list) => ({
        ...list,
        key: list.EMP_ID,
      })),
    });
  };
  useEffect(() => {
    onMount();
  }, []);

  const handleOk = async () => {
    var inputmember = [];

    EmpGrAddEmpDispatch({
      type: "SET_STATE",
      confirmLoading: true,
    });

    if (egrTableData !== null) {
      checkData.map((data) =>
        egrTableData.findIndex((list) => list.EMP_ID === data.EMP_ID) < 0
          ? inputmember.push({
              ...data,
              ["EMPGR_CD"]: selectedData.EMPGR_CD,
              ["EMPGR_NM"]: selectedData.EMPGR_NM,
              ["EMPGREMP_COMMENT"]: "default comment",
              ["MODIFIER_ID"]: HR_USER,
              ["CREATOR_ID"]: selectedData.CREATOR_ID,
            })
          : data
      );
    } else {
      inputmember = checkData.map((list) => ({
        ...list,
        ["EMPGR_CD"]: selectedData.EMPGR_CD,
        ["EMPGR_NM"]: selectedData.EMPGR_NM,
        ["EMPGREMP_COMMENT"]: "default comment",
        ["MODIFIER_ID"]: HR_USER,
        ["CREATOR_ID"]: selectedData.CREATOR_ID,
      }));
    }

    await Axios.post(`${HR_APP}/Employee/InsertEmpGroupEmpList?action=SO`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      dto: {
        EmpGroupEmpList: inputmember,
      },
    });
    var inputdata = [...egrTableData, ...inputmember];
    console.log(inputdata);

    setTimeout(() => {
      onFullMount();
      EmpGrAddEmpDispatch({
        type: "SET_STATE",
        confirmLoading: false,
      });
      EmpGrTableDispatch({
        type: "SET_STATE",
        addEmpVisible: false,
        egrTableData: inputdata,
      });
    }, 1000);
  };
  console.log(egrTableData);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      EmpGrAddEmpDispatch({
        type: "SET_STATE",
        checkData: selectedRows,
      });
    },
  };
  const handleCancel = () => {
    EmpGrTableDispatch({
      type: "SET_STATE",
      addEmpVisible: false,
    });
  };

  return (
    <>
      <Modal
        className="testantd"
        title="Title"
        visible={addEmpVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button
            className="choiyongseok"
            key="submit"
            type="primary"
            onClick={handleOk}
          >
            추가
          </Button>,
          <Button key="back" onClick={handleCancel}>
            닫기
          </Button>,
        ]}
      >
        <Table
          rowKey={(obj) => obj.key}
          columns={columns}
          rowSelection={{ type: "checkbox", ...rowSelection }}
          dataSource={empAddTableData}
        />
      </Modal>
    </>
  );
};

export default EmpGrMemberAddDialog;
