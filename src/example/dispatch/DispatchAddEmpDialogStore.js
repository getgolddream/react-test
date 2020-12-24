import { observable, toJS } from "mobx";
import axios from "axios";
import { HR_APP } from "../../GlobalVariables";
import { DispatchInsertStore } from "./DispatchInsertStore";
import { DispatchDetailStore } from "./DispatchDetailStore";
const DispatchAddEmpDialogStore = observable({
  isinsert: true,
  empAddTableData: [],
  confirmLoading: false,
  modalText: "modal text",
  checkedData: [],
  loading: false,
  error: false,

  onMountDialog: async () => {
    console.dir("onMount: Dialog");
    try {
      DispatchAddEmpDialogStore.loading = true;
      DispatchAddEmpDialogStore.error = null;
      const result = await axios.get(
        `${HR_APP}/Employee/ReadDispatchNow?action=SO`
      );
      const copy = result.data.dto.DispatchEmpNowList.map((list) => ({
        ...list,
        ["key"]: list.EMP_ID,
      }));

      DispatchAddEmpDialogStore.empAddTableData = copy;
    } catch (e) {
      DispatchAddEmpDialogStore.error = e;
    }
    DispatchAddEmpDialogStore.loading = false;
  },

  handleOk: async () => {
    DispatchAddEmpDialogStore.confirmLoading = true;
    let copy = [];
    let distbdata = [];
    {
      DispatchAddEmpDialogStore.isinsert
        ? (distbdata = toJS(DispatchInsertStore.disTableData))
        : (distbdata = toJS(DispatchDetailStore.disreaddata.DispatchEmpList));
    }
    console.log(distbdata);

    let checkdata = toJS(DispatchAddEmpDialogStore.checkedData).map((cd) => ({
      key: cd.EMP_ID,
      EMP_ID: cd.EMP_ID,
      EMP_NM_KOR: cd.EMP_NM_KOR,
      ORG_CD_BF: cd.ORG_CD_AF,
      ORG_CD_AF: cd.ORG_CD_AF,
      DUTY_CD_BF: cd.DUTY_CD_AF,
      DUTY_CD_AF: cd.DUTY_CD_AF,
      POS_CD_BF: cd.POS_CD_AF,
      POS_CD_AF: cd.POS_CD_AF,
      JOB_CD_BF: cd.JOB_CD_AF,
      JOB_CD_AF: cd.JOB_CD_AF,
      DISPATCH_WORKSTATUS_BF: cd.DISPATCH_WORKSTATUS_AF,
      DISPATCH_WORKSTATUS_AF: cd.DISPATCH_WORKSTATUS_AF,
      DISPATCH_MULTIJOB_CH: cd.DISPATCH_MULTIJOB_CH,
      ORG_CD_BF_NM: cd.ORG_CD_AF_NM,
      ORG_CD_AF_NM: "",
      DUTY_CD_BF_NM: cd.DUTY_CD_AF_NM,
      DUTY_CD_AF_NM: "",
      POS_CD_BF_NM: cd.POS_CD_AF_NM,
      POS_CD_AF_NM: "",
      JOB_CD_BF_NM: cd.JOB_CD_AF_NM,
      JOB_CD_AF_NM: "",
      DISPATCH_WORKSTATUS_BF_NM: cd.DISPATCH_WORKSTATUS_AF_NM,
      DISPATCH_WORKSTATUS_AF_NM: "",
      DISPATCH_MULTIJOB_CH_NM: cd.DISPATCH_MULTIJOB_CH_NM,
    }));

    if (distbdata.length !== 0) {
      let addlist = [];
      checkdata.map((cd) =>
        distbdata.findIndex((dd) => dd.EMP_ID === cd.EMP_ID) < 0
          ? addlist.push(cd)
          : console.log("error")
      );
      copy = [...distbdata, ...addlist];
    } else {
      copy = [...checkdata];
    }
    console.log("copy");
    console.log(copy);
    {
      DispatchAddEmpDialogStore.isinsert
        ? ((DispatchInsertStore.disTableData = copy),
          (DispatchInsertStore.dispatchInput.DispatchEmpList = copy))
        : ((DispatchDetailStore.disreaddata.DispatchEmpList = copy),
          (DispatchDetailStore.dispatchInput.DispatchEmpList = copy));
    }

    setTimeout(() => {
      DispatchAddEmpDialogStore.confirmLoading = false;
      {
        DispatchAddEmpDialogStore.isinsert
          ? (DispatchInsertStore.addEmpVisible = false)
          : (DispatchDetailStore.addEmpVisible = false);
      }
    }, 1000);
  },
  handleCancel: async () => {
    {
      DispatchAddEmpDialogStore.isinsert
        ? (DispatchInsertStore.addEmpVisible = false)
        : (DispatchDetailStore.addEmpVisible = false);
    }
  },
});
export { DispatchAddEmpDialogStore };
