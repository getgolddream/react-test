import React, { useEffect, useReducer } from "react";

import { Modal, Button } from "antd";
import Axios from "axios";
import EmpGrMainPageLayout from "../empgr/EmpGrMainPageLayout";
import EmpGrMainTreeViewLayout from "./EmpGrMainTreeViewLayout";
import { render } from "react-dom";
import { HR_APP, HR_USER } from "../../GlobalVariables";

const EmpGrKindDialogReducer = (state, action) => {
  const { type, ...rest } = action;
  switch (type) {
    case "SET_STATE":
      console.log(state);
      return { ...state, ...rest };
    default:
      return state;
  }
};
const EmpGroupKindDialog = ({
  onFullMount,
  mainState,
  EmpGrMainPageDispatch,
}) => {
  const [state, EmpGrKindDialogDispatch] = useReducer(EmpGrKindDialogReducer, {
    confirmLoading: false,
    modalText: "Content of the modal",
    egrkInput: {
      EMPGR_KIND: "",
      EMPGR_KIND_NM: "",
      EMPGR_KIND_COMMENT: "",
      MODIFIER_ID: HR_USER,
      CREATOR_ID: HR_USER,
    },
  });
  const { actionStatus, infoData, egrkVisible } = mainState;
  const { confirmLoading, egrkInput } = state;
  const { EMPGR_KIND_NM, EMPGR_KIND_COMMENT } = egrkInput;

  const onMount = () => {
    if (actionStatus === "U") {
      EmpGrKindDialogDispatch({
        type: "SET_STATE",
        egrkInput: {
          EMPGR_KIND: infoData.EMPGR_KIND,
          EMPGR_KIND_NM: infoData.EMPGR_KIND_NM,
          EMPGR_KIND_COMMENT: infoData.EMPGR_KIND_COMMENT,
          MODIFIER_ID: HR_USER,
          CREATOR_ID: infoData.CREATOR_ID,
        },
      });
    }
  };
  useEffect(() => {
    onMount();
  }, []);

  const onChangeEgrk = (e) => {
    const { name, value } = e.target;
    var templist = { ...egrkInput, [name]: value };
    EmpGrKindDialogDispatch({
      type: "SET_STATE",
      egrkInput: templist,
    });
  };

  const handleOk = async () => {
    EmpGrKindDialogDispatch({
      type: "SET_STATE",
      modalText: "modal will be closed",
      confirmLoading: true,
    });
    switch (actionStatus) {
      case "I":
        await Axios.post(`${HR_APP}/Employee/InsertEmpGroupKind?action=SO`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          dto: egrkInput,
        });
        break;
      case "U":
        await Axios.post(`${HR_APP}/Employee/UpdateEmpGroupKind?action=SO`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          dto: egrkInput,
        });
        const result = await Axios.put(
          `${HR_APP}/Employee/ReadOneEmpGroupKind?action=SO`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            dto: egrkInput,
          }
        );
        EmpGrMainPageDispatch({ type: "SET_STATE", infoData: result.data.dto });
        break;
    }
    setTimeout(() => {
      onFullMount();
      EmpGrKindDialogDispatch({ type: "SET_STATE", confirmLoading: false });
      EmpGrMainPageDispatch({ type: "SET_STATE", egrkVisible: false });
    }, 1000);
  };
  const handleCancel = () => {
    EmpGrMainPageDispatch({
      type: "SET_STATE",
      egrkVisible: false,
    });
  };

  return (
    <>
      <Modal
        title="사원그룹구분추가"
        className="EmpGroupKindDialog"
        visible={egrkVisible}
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
              <input
                className="inputcontent-textfield"
                key="1"
                name="EMPGR_KIND_NM"
                value={EMPGR_KIND_NM}
                onChange={onChangeEgrk}
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
                name="EMPGR_KIND_COMMENT"
                value={EMPGR_KIND_COMMENT}
                onChange={onChangeEgrk}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmpGroupKindDialog;
