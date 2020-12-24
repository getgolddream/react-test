import { observable, toJS } from "mobx";
import axios from "axios";
import { HR_USER, HR_APP } from "../../GlobalVariables";
import columnbasic from "./DispatchColumn/insert_basic_col.json";
import { CommonEmpDialogStore } from "./CommonEmpDialog/CommonEmpDialogStore";
import { useObserver } from "mobx-react";
import { Select } from "antd";
const { Option } = Select;

const DispatchInsertStore = observable({
  dispatchInput: {
    DISPATCH_KIND: "",
    DISPATCH_SUBJECT: "",
    DISPATCH_COMMENT: "",
    DISPATCH_STDT: "",
    DISPATCH_APPR_STATUS: "APPR01",
    CREATOR_ID: HR_USER,
    MODIFIER_ID: HR_USER,
    DispatchEmpList: [],
  },
  disKindSBList: [],
  checkedData: [],
  loading: false,
  error: false,
  orgSBlist: [],
  dutySBlist: [],
  posSBlist: [],
  jobSBlist: [],

  onMount: async () => {
    console.dir("onMount: page");
    try {
      DispatchInsertStore.loading = true;
      DispatchInsertStore.error = null;
      const sbdata = await axios.get(
        `${HR_APP}/Employee/ReadDispatchSBAll?action=SO`
      );
      DispatchInsertStore.disKindSBList =
        sbdata.data.dto.DispatchSbKindList[0].DispatchSBList;
      DispatchInsertStore.orgSBlist =
        sbdata.data.dto.DispatchSBOrgList[0].DispatchSBList;
      DispatchInsertStore.dutySBlist =
        sbdata.data.dto.DispatchSBDutyList[0].DispatchSBList;
      DispatchInsertStore.posSBlist =
        sbdata.data.dto.DispatchSBPosList[0].DispatchSBList;
      DispatchInsertStore.jobSBlist =
        sbdata.data.dto.DispatchSBJobList[0].DispatchSBList;
    } catch (e) {
      DispatchInsertStore.error = e;
    }
    DispatchInsertStore.loading = false;
  },
  filternovalue: (dislist, workstatusvalue, multijobvalue) => {
    dislist.map(
      (list) => (
        list.ORG_CD_AF === undefined || list.ORG_CD_AF === ""
          ? (list.ORG_CD_AF = list.ORG_CD_BF)
          : null,
        list.DUTY_CD_AF === undefined || list.DUTY_CD_AF === ""
          ? (list.DUTY_CD_AF = list.DUTY_CD_BF)
          : null,
        list.POS_CD_AF === undefined || list.POS_CD_AF === ""
          ? (list.POS_CD_AF = list.POS_CD_BF)
          : null,
        list.JOB_CD_AF === undefined || list.JOB_CD_AF === ""
          ? (list.JOB_CD_AF = list.JOB_CD_BF)
          : null,
        workstatusvalue === null
          ? null
          : (list.DISPATCH_WORKSTATUS_AF = workstatusvalue),
        multijobvalue === null
          ? null
          : (list.DISPATCH_MULTIJOB_CH = multijobvalue)
      )
    );
    console.log(dislist);
  },
  onClickSave: async (moveToMainPage) => {
    let disinput = toJS(DispatchInsertStore.dispatchInput);
    let diskind = disinput.DISPATCH_KIND;
    let dislist = disinput.DispatchEmpList;

    if (diskind === "") {
      alert("발령필수값인 발령구분을 넣어주십시오");
    } else if (disinput.DISPATCH_STDT === "") {
      alert("발령필수값인 발령일을 넣어주십시오");
    } else if (dislist.length === 0) {
      alert("발령필수값인 발령대상을 넣어주십시오");
    } else {
      switch (diskind) {
        case "DISWST01": //퇴직: AF값을 모두NULL처리, 재직상태 퇴직으로
          dislist.map(
            (list) => (
              (list.ORG_CD_AF = null),
              (list.DUTY_CD_AF = null),
              (list.POS_CD_AF = null),
              (list.JOB_CD_AF = null),
              (list.DISPATCH_WORKSTATUS_AF = "WST003")
            )
          );
          break;
        case "DISWST02": //휴직: 재직상태 휴직으로
          DispatchInsertStore.filternovalue(dislist, "WST002", null);
          break;
        case "DISWST03": //복직: 재직상태 재직으로
          DispatchInsertStore.filternovalue(dislist, "WST001", null);
          break;
        case "DISMULTIJOB01": //겸직등록: 겸직 으로등록
          DispatchInsertStore.filternovalue(dislist, null, "MULTIJOB02");
          break;
        case "DISMULTIJOB02": //겸직해제: AF값을 모두NULL처리
          dislist.map(
            (list) => (
              (list.ORG_CD_AF = null),
              (list.DUTY_CD_AF = null),
              (list.POS_CD_AF = null),
              (list.JOB_CD_AF = null)
            )
          );
          break;
        default:
          //신규발령+전체: 재직상태 재직으로, 겸직 : 주로 변경
          DispatchInsertStore.filternovalue(dislist, null, null);
          break;
      }
      disinput.DispatchEmpList = dislist;
      disinput.DISPATCH_APPR_STATUS = "APPR01";
      disinput.CREATOR_ID = HR_USER;
      disinput.MODIFIER_ID = HR_USER;
      try {
        await axios.post(`${HR_APP}/Employee/InsertDispatchGroup?action=SO`, {
          dto: disinput,
        });
        moveToMainPage();
      } catch (e) {
        DispatchInsertStore.error = e;
      }
    }
  },

  onChangeDisSubject: (e) => {
    const value = e.target.value;
    DispatchInsertStore.dispatchInput.DISPATCH_SUBJECT = value;
  },
  onChangeDisComment: (e) => {
    const value = e.target.value;
    DispatchInsertStore.dispatchInput.DISPATCH_COMMENT = value;
  },
  onSelectDisStdt: (e, value) => {
    DispatchInsertStore.dispatchInput.DISPATCH_STDT = value.replaceAll("-", "");
  },
  onChangeJobSB: (value, id, index) => {
    DispatchInsertStore.dispatchInput.DispatchEmpList[index].JOB_CD_AF = value;
  },
  onChangeOrgSB: (value, id, index) => {
    DispatchInsertStore.dispatchInput.DispatchEmpList[index].ORG_CD_AF = value;
  },
  onChangeDutySB: (value, id, index) => {
    DispatchInsertStore.dispatchInput.DispatchEmpList[index].DUTY_CD_AF = value;
  },
  onChangePosSB: (value, id, index) => {
    DispatchInsertStore.dispatchInput.DispatchEmpList[index].POS_CD_AF = value;
  },

  showAddEmpModal: () => {
    if (DispatchInsertStore.dispatchInput.DISPATCH_KIND === "") {
      alert("발령구분을 먼저 선택해주십시오");
    } else {
      CommonEmpDialogStore.originalTableData =
        DispatchInsertStore.dispatchInput.DispatchEmpList;
      CommonEmpDialogStore.addCommonEmpVisible = true;
      CommonEmpDialogStore.isEmpGrType = false;
      CommonEmpDialogStore.isUpdate = false;
    }
  },
  showAddEmpGrModal: () => {
    if (DispatchInsertStore.dispatchInput.DISPATCH_KIND === "") {
      alert("발령구분을 먼저 선택해주십시오");
    } else {
      CommonEmpDialogStore.originalTableData =
        DispatchInsertStore.dispatchInput.DispatchEmpList;
      CommonEmpDialogStore.addCommonEmpVisible = true;
      CommonEmpDialogStore.isEmpGrType = true;
      CommonEmpDialogStore.isUpdate = false;
    }
  },
});

export { DispatchInsertStore };
