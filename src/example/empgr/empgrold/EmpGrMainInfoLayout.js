import { Button, Popconfirm, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import EmpGroupDialog from "./EmpGroupDialog";
import EmpGroupKindDialog from "./EmpGroupKindDialog";
import { HR_APP, HR_USER } from "../../GlobalVariables";
import Axios from "axios";
function EmpGrMainInfoLayout({
  mainState,
  onFullMount,
  EmpGrMainPageDispatch,
}) {
  const {
    selectedData,
    clickStatus,
    egrkVisible,
    egrVisible,
    infoData,
  } = mainState;
  const text = "Are you sure to delete this task?";
  const onMount = () => {
    EmpGrMainPageDispatch({
      type: "SET_STATE",
      infoData: selectedData,
    });
  };
  useEffect(() => {
    onMount();
  }, [selectedData]);
  console.log(infoData);

  const showEgrkModal = () => {
    console.log("showEgrkModal");
    EmpGrMainPageDispatch({
      type: "SET_STATE",
      actionStatus: "U",
      egrkVisible: true,
    });
  };
  const showEgrModal = () => {
    console.log("showEgrModal");
    EmpGrMainPageDispatch({
      type: "SET_STATE",
      actionStatus: "U",
      egrVisible: true,
    });
  };
  const confirm = async (e) => {
    console.log(e);
    message.success("Click on Yes");
    var url = "";
    console.log(infoData);
    if (clickStatus === "EMPGR_KIND") {
      url = `${HR_APP}/Employee/DeleteEmpGroupKind?action=SO`;
    } else {
      url = `${HR_APP}/Employee/DeleteEmpGroup?action=SO`;
    }
    await Axios.post(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      dto: infoData,
    });
    onFullMount();
    EmpGrMainPageDispatch({
      type: "SET_STATE",
      infoData: {
        EMPGR_CD: "",
        EMPGR_NM: "",
        EMPGR_COMMENT: "",
        EMPGR_KIND: "",
        EMPGR_KIND_NM: "",
        EMPGR_KIND_COMMENT: "",
        MODIFIER_ID: "",
        MODIFY_TS: "",
        CREATOR_ID: "",
        CREATE_TS: "",
      },
      clickStatus: "EMPGR_KIND",
    });
  };

  function cancel(e) {
    console.log(e);
    message.error("Click on No");
  }

  return (
    <>
      <Button
        className="button-white"
        style={{ width: "70px" }}
        onClick={clickStatus === "EMPGR_KIND" ? showEgrkModal : showEgrModal}
      >
        수정
      </Button>
      <Popconfirm
        placement="top"
        title={text}
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button
          className="button-white"
          style={{ width: "70px", marginLeft: "6px" }}
        >
          삭제
        </Button>
      </Popconfirm>

      {egrkVisible ? (
        <EmpGroupKindDialog
          onFullMount={onFullMount}
          mainState={mainState}
          EmpGrMainPageDispatch={EmpGrMainPageDispatch}
        />
      ) : null}
      {egrVisible ? (
        <EmpGroupDialog
          onFullMount={onFullMount}
          mainState={mainState}
          EmpGrMainPageDispatch={EmpGrMainPageDispatch}
        />
      ) : null}
      <div className="linelayout-page-first">
        <div className="inputtitle-page">
          <b className="inputtitle-font">사원그룹구분명</b>
        </div>
        <div className="inputcontent-page">
          <b className="inputtitle-font">{infoData.EMPGR_KIND_NM}</b>
        </div>
      </div>
      {clickStatus === "EMPGR_KIND" ? null : (
        <div className="linelayout-page">
          <div className="inputtitle-page">
            <b className="inputtitle-font">사원그룹명</b>
          </div>
          <div className="inputcontent-page">
            <b className="inputtitle-font">{infoData.EMPGR_NM}</b>
          </div>
        </div>
      )}
      <div className="linelayout-page">
        <div className="inputtitle-page">
          <b className="inputtitle-font">비고</b>
        </div>
        {clickStatus === "EMPGR_KIND" ? (
          <div className="inputcontent-page">
            <b className="inputtitle-font">{infoData.EMPGR_KIND_COMMENT}</b>
          </div>
        ) : (
          <div className="inputcontent-page">
            <b className="inputtitle-font">{infoData.EMPGR_COMMENT}</b>
          </div>
        )}
      </div>
      <div className="linelayout-page">
        <div className="inputtitle-page">
          <b className="inputtitle-font">생성자</b>
        </div>
        <div className="inputcontent-page">
          <b className="inputtitle-font">{infoData.CREATOR_NM}</b>
        </div>
      </div>
      <div className="linelayout-page">
        <div className="inputtitle-page">
          <b className="inputtitle-font">생성일</b>
        </div>
        <div className="inputcontent-page">
          <b className="inputtitle-font">{infoData.CREATE_TS}</b>
        </div>
      </div>
      <div className="linelayout-page">
        <div className="inputtitle-page">
          <b className="inputtitle-font">작성자</b>
        </div>
        <div className="inputcontent-page">
          <b className="inputtitle-font">{infoData.MODIFIER_NM}</b>
        </div>
      </div>
      <div className="linelayout-page">
        <div className="inputtitle-page">
          <b className="inputtitle-font">작성일</b>
        </div>
        <div className="inputcontent-page">
          <b className="inputtitle-font">{infoData.MODIFY_TS}</b>
        </div>
      </div>
    </>
  );
}

export default EmpGrMainInfoLayout;
