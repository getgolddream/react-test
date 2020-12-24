import { Typography, Space } from "antd";
import React, { useCallback, useEffect, useReducer } from "react";
import EmpGrMainTreeViewLayout from "./EmpGrMainTreeViewLayout";
import EmpGrMainInfoLayout from "./EmpGrMainInfoLayout";
import EmpGrMainTableLayout from "./EmpGrMainTableLayout";
import empgr from "../../components/empgr.css";
import Axios from "axios";
import { HR_APP, HR_USER } from "../../GlobalVariables";

const { Title, Text } = Typography;

const EmpGrMainTitle = React.memo(() => {
  console.dir("EmpGrMainTitle");
  return (
    <>
      <Title style={{ marginTop: 30 }} level={4}>
        사원 그룹
      </Title>
    </>
  );
});

const EmpGrMainPageReducer = (state, action) => {
  const { type, ...rest } = action;
  switch (type) {
    case "SET_STATE":
      console.log(state);
      return { ...state, ...rest };
    default:
      return state;
  }
};
function EmpGrMainPageLayout() {
  //reducer setting
  const [mainState, EmpGrMainPageDispatch] = useReducer(EmpGrMainPageReducer, {
    empgrFullData: [],
    clickStatus: "EMPGR_KIND",
    actionStatus: "I",
    selectedData: {
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
    egrkVisible: false,
    egrVisible: false,
    infoData: {},
  });
  const { empgrFullData, clickStatus, selectedData } = mainState;

  //onMount action
  const onFullMount = useCallback(async () => {
    const result = await Axios.get(
      `${HR_APP}/Employee/ReadEmpGroupFullList?action=SO`
    );
    EmpGrMainPageDispatch({
      type: "SET_STATE",
      empgrFullData: result.data.dto.EmpGroupKindList,
    });
  }, []);
  useEffect(async () => {
    try {
      onFullMount();
    } catch (e) {
      EmpGrMainPageDispatch({ type: "SET_STATE", error: e });
    }
  }, []);

  return (
    <>
      <Space direction="vertical">
        <Space>
          <EmpGrMainTitle />
        </Space>
        <Space direction="horizontal" align="start">
          <Space>
            {empgrFullData.length !== 0 ? (
              <EmpGrMainTreeViewLayout
                onFullMount={onFullMount}
                mainState={mainState}
                EmpGrMainPageDispatch={EmpGrMainPageDispatch}
              />
            ) : null}
          </Space>
          <Space direction="vertical">
            <Space>
              <EmpGrMainInfoLayout
                mainState={mainState}
                onFullMount={onFullMount}
                EmpGrMainPageDispatch={EmpGrMainPageDispatch}
              />
            </Space>
            <Space>
              {clickStatus === "EMPGR" ? (
                <EmpGrMainTableLayout
                  selectedData={selectedData}
                  onFullMount={onFullMount}
                />
              ) : null}
            </Space>
          </Space>
        </Space>
      </Space>
    </>
  );
}

export default EmpGrMainPageLayout;
