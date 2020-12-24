import { observable, toJS } from "mobx";
import axios from "axios";
import { HR_USER, HR_APP } from "../../GlobalVariables";
import columnbasic from "./DispatchColumn/insert_basic_col.json";
import { useObserver } from "mobx-react";
import { Select } from "antd";

export const DispatchDetailStore = observable({
  dispatchid: "",
  disreaddata: {},
  isread: true,
  dispatchInput: {
    DISPATCH_KIND: "",
    DISPATCH_SUBJECT: "",
    DISPATCH_COMMENT: "",
    DISPATCH_STDT: "",
    DISPATCH_APPR_STATUS: "APPR01",
    CREATOR_ID: "",
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
  addEmpVisible: false,
  onMount: async (dispatchid, onChangeDiskind) => {
    console.log("onMount");
    console.log(dispatchid);
    try {
      DispatchDetailStore.loading = true;
      DispatchDetailStore.error = null;
      const result = await axios.put(
        `${HR_APP}/Employee/ReadDispatchGroupDetail?action=SO`,
        {
          dto: { DISPATCH_ID: dispatchid },
        }
      );
      const sbdata = await axios.get(
        `${HR_APP}/Employee/ReadDispatchSBAll?action=SO`
      );
      DispatchDetailStore.disKindSBList =
        sbdata.data.dto.DispatchSbKindList[0].DispatchSBList;
      DispatchDetailStore.orgSBlist =
        sbdata.data.dto.DispatchSBOrgList[0].DispatchSBList;
      DispatchDetailStore.dutySBlist =
        sbdata.data.dto.DispatchSBDutyList[0].DispatchSBList;
      DispatchDetailStore.posSBlist =
        sbdata.data.dto.DispatchSBPosList[0].DispatchSBList;
      DispatchDetailStore.jobSBlist =
        sbdata.data.dto.DispatchSBJobList[0].DispatchSBList;
      console.log(result.data.dto);
      DispatchDetailStore.disreaddata = result.data.dto;
      DispatchDetailStore.dispatchInput = result.data.dto;
      onChangeDiskind();
    } catch (e) {
      DispatchDetailStore.error = e;
    }
    DispatchDetailStore.loading = false;
  },

  onClickDispatch: () => {
    alert("추후결재연동예정");
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
    let disinput = toJS(DispatchDetailStore.dispatchInput);
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
          DispatchDetailStore.filternovalue(dislist, "WST002", null);
          break;
        case "DISWST03": //복직: 재직상태 재직으로
          DispatchDetailStore.filternovalue(dislist, "WST001", null);
          break;
        case "DISMULTIJOB01": //겸직등록: 겸직 으로등록
          DispatchDetailStore.filternovalue(dislist, null, "MULTIJOB02");
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
          DispatchDetailStore.filternovalue(dislist, null, null);
          break;
      }
      disinput.DispatchEmpList = dislist;
      disinput.DISPATCH_APPR_STATUS = "APPR01";
      disinput.CREATOR_ID = HR_USER;
      disinput.MODIFIER_ID = HR_USER;
      console.log(disinput);
      try {
        await axios.post(`${HR_APP}/Employee/UpdateDispatchGroup?action=SO`, {
          dto: disinput,
        });
        moveToMainPage();
      } catch (e) {
        DispatchDetailStore.error = e;
      }
    }
  },

  onChangeDisSubject: (e) => {
    const value = e.target.value;
    DispatchDetailStore.dispatchInput.DISPATCH_SUBJECT = value;
  },
  onChangeDisComment: (e) => {
    const value = e.target.value;
    DispatchDetailStore.dispatchInput.DISPATCH_COMMENT = value;
  },
  onSelectDisStdt: (e, value) => {
    DispatchDetailStore.dispatchInput.DISPATCH_STDT = value.replaceAll("-", "");
  },
  onChangeJobSB: (value, id, idx) => {
    DispatchDetailStore.dispatchInput.DispatchEmpList[idx].JOB_CD_AF = value;
  },
  onChangeOrgSB: (value, id, idx) => {
    DispatchDetailStore.dispatchInput.DispatchEmpList[idx].ORG_CD_AF = value;
  },
  onChangeDutySB: (value, id, idx) => {
    DispatchDetailStore.dispatchInput.DispatchEmpList[idx].DUTY_CD_AF = value;
  },
  onChangePosSB: (value, id, idx) => {
    DispatchDetailStore.dispatchInput.DispatchEmpList[idx].POS_CD_AF = value;
  },

  showAddEmpModal: () => {
    if (DispatchDetailStore.dispatchInput.DISPATCH_KIND === "") {
      alert("발령구분을 먼저 선택해주십시오");
    } else {
      CommonEmpDialogStore.originalTableData =
        DispatchDetailStore.dispatchInput.DispatchEmpList;
      CommonEmpDialogStore.addCommonEmpVisible = true;
      CommonEmpDialogStore.isEmpGrType = false;
      CommonEmpDialogStore.isUpdate = true;
    }
  },
  showAddEmpGrModal: () => {
    if (DispatchDetailStore.dispatchInput.DISPATCH_KIND === "") {
      alert("발령구분을 먼저 선택해주십시오");
    } else {
      CommonEmpDialogStore.originalTableData =
        DispatchDetailStore.dispatchInput.DispatchEmpList;
      CommonEmpDialogStore.addCommonEmpVisible = true;
      CommonEmpDialogStore.isEmpGrType = true;
      CommonEmpDialogStore.isUpdate = true;
    }
  },
});
