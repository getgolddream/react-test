import { observable, toJS } from "mobx";
import axios from "axios";
import { HR_APP } from "../../../GlobalVariables";
import { DispatchInsertStore } from "../DispatchInsertStore";
import { DispatchDetailStore } from "../DispatchDetailStore";
const CommonEmpDialogStore = observable({
  originalTableData: [],
  addCommonEmpVisible: false,
  commonTableData: [],
  confirmLoading: false,
  searchEmpGrKind: "",
  searchEmpGr: "",
  columns: [],
  modalText: "modal text",
  checkedData: [],
  loading: false,
  error: false,
  searchdata: {
    SEARCH_FIELD: "",
    SEARCH_VALUE: "",
  },
  empgrfulllist: [],
  empgrFullSB: [],
  empgrSelectedSB: [],
  isChecked: false,
  isEmpGrType: false,
  isUpdate: false,
  onMountDialog: async () => {
    console.dir("onMount: CommonEmpDialog");
    try {
      CommonEmpDialogStore.loading = true;
      CommonEmpDialogStore.error = null;
      const result = await axios.get(
        `${HR_APP}/Employee/ReadDispatchNow?action=SO`
      );
      const copy = result.data.dto.DispatchEmpNowList.map((list) => ({
        ...list,
        ["key"]: list.EMP_ID,
      }));
      CommonEmpDialogStore.columns = [
        { id: "name", title: "이름", dataIndex: "EMP_NM_KOR" },
        { id: "empid", title: "사번", dataIndex: "EMP_ID" },
        { id: "org", title: "조직", dataIndex: "ORG_CD_AF_NM" },
        { id: "pos", title: "직위", dataIndex: "POS_CD_AF_NM" },
        { id: "job", title: "직무", dataIndex: "JOB_CD_AF_NM" },
        { id: "duty", title: "직책", dataIndex: "DUTY_CD_AF_NM" },
        {
          id: "workstatus",
          title: "재직상태",
          dataIndex: "DISPATCH_WORKSTATUS_AF_NM",
        },
      ];

      CommonEmpDialogStore.commonTableData = copy;
    } catch (e) {
      CommonEmpDialogStore.error = e;
    }
    CommonEmpDialogStore.loading = false;
  },
  onMountEmpGrDialog: async () => {
    console.dir("onMount: CommonEmpGrDialog");
    try {
      CommonEmpDialogStore.loading = true;
      CommonEmpDialogStore.error = null;
      const result = await axios.get(
        `${HR_APP}/Employee/ReadEmpGroupFullList?action=SO`
      );
      const tableresult = await axios.get(
        `${HR_APP}/Employee/ReadDispatchNow?action=SO`
      );

      CommonEmpDialogStore.empgrfulllist = result.data.dto.EmpGroupKindList;
      let copy = CommonEmpDialogStore.empgrfulllist;
      let empgrsb = [];
      let tabledata = [];
      copy.map((list) =>
        list.EmpGroupList !== null ? empgrsb.push(...list.EmpGroupList) : null
      );

      CommonEmpDialogStore.empgrFullSB = empgrsb;
      CommonEmpDialogStore.empgrSelectedSB = empgrsb;
      CommonEmpDialogStore.empgrSelectedSB.map((list) =>
        list.EmpGroupEmpList !== null
          ? tabledata.push(...list.EmpGroupEmpList)
          : null
      );
      CommonEmpDialogStore.commonTableData = tabledata;
      CommonEmpDialogStore.columns = [
        { id: "name", title: "이름", dataIndex: "EMP_NM_KOR" },
        { id: "empid", title: "사번", dataIndex: "EMP_ID" },
        { id: "empgr", title: "사원그룹", dataIndex: "EMPGR_NM" },
        { id: "org", title: "조직", dataIndex: "ORG_CD_AF_NM" },
        { id: "pos", title: "직위", dataIndex: "POS_CD_AF_NM" },
        { id: "job", title: "직무", dataIndex: "JOB_CD_AF_NM" },
        { id: "duty", title: "직책", dataIndex: "DUTY_CD_AF_NM" },
        {
          id: "workstatus",
          title: "재직상태",
          dataIndex: "DISPATCH_WORKSTATUS_AF_NM",
        },
      ];
      console.log(toJS(CommonEmpDialogStore.empgrSB));
    } catch (e) {
      CommonEmpDialogStore.error = e;
    }
    CommonEmpDialogStore.loading = false;
  },
  onChangeEgrKind: (value) => {
    console.log("onChangeEgrKind");
    const copy = toJS(CommonEmpDialogStore.empgrFullSB);
    let newlist = copy.filter((list) => list["EMPGR_KIND"] === value);
    CommonEmpDialogStore.empgrSelectedSB = newlist;
    let tabledata = [];
    newlist.map((list) =>
      list.EmpGroupEmpList !== null
        ? tabledata.push(...list.EmpGroupEmpList)
        : null
    );
    CommonEmpDialogStore.commonTableData = tabledata;
    CommonEmpDialogStore.searchEmpGrKind = value;
    CommonEmpDialogStore.searchEmpGr = "";
  },
  onChangeEgr: (value) => {
    console.log("onChangeEgr");
    console.log(value);
    const copy = toJS(CommonEmpDialogStore.empgrSelectedSB);
    console.log(copy);
    let newlist = copy.filter((list) => list["EMPGR_CD"] === value);
    console.log(newlist[0]);
    newlist[0].EmpGroupEmpList !== null
      ? (CommonEmpDialogStore.commonTableData = newlist[0].EmpGroupEmpList)
      : (CommonEmpDialogStore.commonTableData = []);
    CommonEmpDialogStore.searchEmpGr = "";
  },

  handleOk: async () => {
    CommonEmpDialogStore.confirmLoading = true;

    let copy = [];
    let originaldata = CommonEmpDialogStore.originalTableData;
    let newcheckdata = CommonEmpDialogStore.checkedData.map((cd) => ({
      key: cd.EMP_ID,
      EMP_ID: cd.EMP_ID,
      EMP_NM_KOR: cd.EMP_NM_KOR,
      ORG_CD_BF: cd.ORG_CD_AF,
      ORG_CD_AF: "",
      DUTY_CD_BF: cd.DUTY_CD_AF,
      DUTY_CD_AF: "",
      POS_CD_BF: cd.POS_CD_AF,
      POS_CD_AF: "",
      JOB_CD_BF: cd.JOB_CD_AF,
      JOB_CD_AF: "",
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
      CUD_CHECKER: "I",
    }));

    if (originaldata.length !== 0) {
      let addlist = [];
      newcheckdata.map((cd) =>
        originaldata.findIndex((dd) => dd.EMP_ID === cd.EMP_ID) < 0
          ? addlist.push(cd)
          : console.log("error")
      );
      copy = [...originaldata, ...addlist];
    } else {
      copy = [...newcheckdata];
    }
    //   3. handle ok에서 만든 copy를 원본 테이블 데이터에 세팅한다.
    CommonEmpDialogStore.isUpdate
      ? (DispatchDetailStore.dispatchInput.DispatchEmpList = copy)
      : (DispatchInsertStore.dispatchInput.DispatchEmpList = copy);
    CommonEmpDialogStore.searchdata = {
      SEARCH_FIELD: "",
      SEARCH_VALUE: "",
    };
    setTimeout(() => {
      CommonEmpDialogStore.confirmLoading = false;
      CommonEmpDialogStore.addCommonEmpVisible = false;
    }, 1000);
  },
  handleCancel: async () => {
    CommonEmpDialogStore.searchdata = {
      SEARCH_FIELD: "",
      SEARCH_VALUE: "",
    };
    CommonEmpDialogStore.addCommonEmpVisible = false;
  },
  detailSearch: async () => {
    const copy = toJS(CommonEmpDialogStore.commonTableData);
    const searchfield = toJS(CommonEmpDialogStore.searchdata.SEARCH_FIELD);
    const searchvalue = toJS(CommonEmpDialogStore.searchdata.SEARCH_VALUE);
    if (CommonEmpDialogStore.isChecked) {
      const newdata = copy.filter((list) =>
        list[searchfield] === null
          ? console.log("null")
          : list[searchfield].includes(searchvalue)
      );
      CommonEmpDialogStore.commonTableData = newdata;
    } else {
      const result = await axios.post(
        `${HR_APP}/Employee/ReadDispatchNow?action=SO`,
        {
          dto: { [searchfield]: searchvalue },
        }
      );
      const copy = result.data.dto.DispatchEmpNowList.map((list) => ({
        ...list,
        ["key"]: list.EMP_ID,
      }));

      CommonEmpDialogStore.commonTableData = copy;
    }
  },
  onChangeSearchValue: (e) => {
    CommonEmpDialogStore.searchdata.SEARCH_VALUE = e.target.value;
  },
  onSelectSearchField: (value) => {
    CommonEmpDialogStore.searchdata.SEARCH_FIELD = value;
  },
  onChangeCheck: (e) => {
    console.log(e.target.checked);
    CommonEmpDialogStore.isChecked = e.target.checked;
    CommonEmpDialogStore.searchdata.SEARCH_VALUE = null;
  },
});
export { CommonEmpDialogStore };
