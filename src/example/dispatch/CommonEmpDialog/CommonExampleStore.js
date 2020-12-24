import { observable, toJS } from "mobx";
import axios from "axios";
import { CommonEmpDialogStore } from "./CommonEmpDialogStore";
const CommonExampleStore = observable({
  tabledata: [
    {
      key: 0,
      EMP_ID: 3001,
      EMP_NM_KOR: "최용석",
      ORG_CD_BF_NM: "조직예제",
      POS_CD_BF_NM: "직위예제",
      JOB_CD_BF_NM: "직무예제",
      DUTY_CD_BF_NM: "직책예제",
    },
  ],
  showModal: () => {
    CommonEmpDialogStore.isEmpGrType = false;
    //1. original tabledata에 현재 data를 setting해준다.
    CommonEmpDialogStore.originalTableData = CommonExampleStore.tabledata;
    //2. modalvisible을 해준다
    CommonEmpDialogStore.addCommonEmpVisible = true;
  },
  showEmpGrModal: () => {
    CommonEmpDialogStore.isEmpGrType = true;
    //1. original tabledata에 현재 data를 setting해준다.
    CommonEmpDialogStore.originalTableData = CommonExampleStore.tabledata;
    //2. modalvisible을 해준다
    CommonEmpDialogStore.addCommonEmpVisible = true;
  },
});
export { CommonExampleStore };
