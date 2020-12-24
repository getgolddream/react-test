import React, { useCallback, useEffect, useReducer, useState } from "react";

import { Modal, Button, Select } from "antd";
import Axios from "axios";
import { HR_APP, HR_USER } from "../../GlobalVariables";
const { Option } = Select;
const EmpGrDialogReducer = (state, action) => {
  const { type, ...rest } = action;
  switch (type) {
    case "SET_STATE":
      return { ...state, ...rest };
    default:
      return state;
  }
};
const EmpGroupDialog = ({ onFullMount, mainState, EmpGrMainPageDispatch }) => {
  const [state, EmpGrDialogDispatch] = useReducer(EmpGrDialogReducer, {
    confirmLoading: false,
    modalText: "Content of the modal",
    egrInput: {
      EMPGR_CD: "",
      EMPGR_NM: "",
      EMPGR_KIND: "",
      EMPGR_COMMENT: "",
      MODIFIER_ID: HR_USER,
      CREATOR_ID: HR_USER,
    },
  });
  const {
    actionStatus,
    selectedData,
    egrVisible,
    empgrFullData,
    infoData,
  } = mainState;
  const { confirmLoading, modalText, egrInput } = state;
  const { EMPGR_KIND, EMPGR_NM, EMPGR_COMMENT } = egrInput;

  const onChangeEgr = (e) => {
    const { name, value } = e.target;
    EmpGrDialogDispatch({
      type: "SET_STATE",
      egrInput: { ...egrInput, [name]: value },
    });
  };
  const onSelectEgr = (value) => {
    EmpGrDialogDispatch({
      type: "SET_STATE",
      egrInput: { ...egrInput, ["EMPGR_KIND"]: value },
    });
  };
  console.log("infoData");
  console.log(infoData);
  const onMount = () => {
    if (actionStatus === "U") {
      EmpGrDialogDispatch({
        type: "SET_STATE",
        egrInput: {
          EMPGR_CD: infoData.EMPGR_CD,
          EMPGR_KIND: infoData.EMPGR_KIND,
          EMPGR_NM: infoData.EMPGR_NM,
          EMPGR_COMMENT: infoData.EMPGR_COMMENT,
          MODIFIER_ID: HR_USER,
          CREATOR_ID: infoData.CREATOR_ID,
        },
      });
    } else {
      EmpGrDialogDispatch({
        type: "SET_STATE",
        egrInput: {
          EMPGR_KIND: selectedData.EMPGR_KIND,
          EMPGR_NM: "",
          EMPGR_COMMENT: "",
          MODIFIER_ID: HR_USER,
          CREATOR_ID: HR_USER,
        },
      });
    }
  };
  useEffect(() => {
    onMount();
  }, []);
  const handleOk = async () => {
    EmpGrDialogDispatch({
      type: "SET_STATE",
      modalText: "modal will be closed",
      confirmLoading: true,
    });
    console.log(egrInput);
    switch (actionStatus) {
      case "I":
        await Axios.post(`${HR_APP}/Employee/InsertEmpGroup?action=SO`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          dto: egrInput,
        });
        break;
      case "U":
        await Axios.post(`${HR_APP}/Employee/UpdateEmpGroup?action=SO`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          dto: egrInput,
        });
        const result = await Axios.put(
          `${HR_APP}/Employee/ReadOneEmpGroup?action=SO`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            dto: egrInput,
          }
        );
        EmpGrMainPageDispatch({ type: "SET_STATE", infoData: result.data.dto });
        break;
    }
    setTimeout(() => {
      onFullMount();
      EmpGrDialogDispatch({ type: "SET_STATE", confirmLoading: false });
      EmpGrMainPageDispatch({ type: "SET_STATE", egrVisible: false });
    }, 1000);
  };
  const handleCancel = () => {
    EmpGrMainPageDispatch({
      type: "SET_STATE",
      egrVisible: false,
    });
  };

  return (
    <>
      <Modal
        title="사원그룹추가"
        className="EmpGroupDialog"
        visible={egrVisible}
        confirmLoading={confirmLoading}
        width={490}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            {actionStatus === "I" ? "추가" : "수정"}
          </Button>,
          <Button key="back" onClick={handleCancel}>
            닫기
          </Button>,
        ]}
      >
        <div className="modalcontent490x361">
          <div className="linelayout">
            <div className="inputtitle">
              <b className="inputtitle-font">사원그룹구분명</b>
            </div>
            <div className="inputcontent">
              {actionStatus === "I" ? (
                <b className="inputtitle-font">{selectedData.EMPGR_KIND_NM}</b>
              ) : (
                <Select
                  className="inputcontent-selectbox"
                  value={EMPGR_KIND}
                  onChange={onSelectEgr}
                >
                  {empgrFullData.map((list) => (
                    <Option key={list.EMPGR_KIND} value={list.EMPGR_KIND}>
                      {list.EMPGR_KIND_NM}
                    </Option>
                  ))}
                </Select>
              )}
            </div>
          </div>
          <div className="linelayout">
            <div className="inputtitle">
              <b className="inputtitle-font">사원그룹명</b>
            </div>
            <div className="inputcontent">
              <input
                className="inputcontent-textfield"
                key="1"
                name="EMPGR_NM"
                value={EMPGR_NM}
                onChange={onChangeEgr}
              />
            </div>
          </div>
          <div className="linelayout-comment">
            <div className="inputtitle">
              <b className="inputtitle-font">비고</b>
            </div>
            <div className="inputcontent">
              <input
                className="inputcontent-textarea"
                key="2"
                name="EMPGR_COMMENT"
                value={EMPGR_COMMENT}
                onChange={onChangeEgr}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmpGroupDialog;
