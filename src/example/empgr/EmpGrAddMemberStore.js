import { observable, toJS } from "mobx";
import axios from "axios";
import { HR_APP } from "../../GlobalVariables";
import { EmpGrMainStore } from "./EmpGrMainStore";
const EmpGrAddMemberStore = observable({
  originalTableData: [],
  addCommonEmpVisible: false,
  commonTableData: [],
  confirmLoading: false,
  modalText: "modal text",
  checkedData: [],
  loading: false,
  error: false,
  searchdata: {
    SEARCH_FIELD: "",
    SEARCH_VALUE: "",
  },
  isChecked: false,
  isEmpGrType: false,
  onMountDialog: async () => {
    console.dir("onMount: CommonEmpDialog");
    try {
      EmpGrAddMemberStore.loading = true;
      EmpGrAddMemberStore.error = null;
      const result = await axios.get(
        `${HR_APP}/Employee/ReadDispatchNow?action=SO`
      );
      const copy = result.data.dto.DispatchEmpNowList.map((list) => ({
        ...list,
        ["key"]: list.EMP_ID,
      }));

      EmpGrAddMemberStore.commonTableData = copy;
    } catch (e) {
      EmpGrAddMemberStore.error = e;
    }
    EmpGrAddMemberStore.loading = false;
  },
  handleOk: async () => {
    EmpGrAddMemberStore.confirmLoading = true;
    let originaldata = EmpGrAddMemberStore.originalTableData;
    let newcheckdata = EmpGrAddMemberStore.checkedData;
    for (let i in originaldata) {
      newcheckdata = newcheckdata.filter(
        (list) => list.EMP_ID !== originaldata[i].EMP_ID
      );
    }
    EmpGrMainStore.tabledata = [...originaldata, ...newcheckdata];
    EmpGrAddMemberStore.searchdata = {
      SEARCH_FIELD: "",
      SEARCH_VALUE: "",
    };
    setTimeout(() => {
      EmpGrAddMemberStore.confirmLoading = false;
      EmpGrAddMemberStore.addCommonEmpVisible = false;
    }, 1000);
  },
  handleCancel: async () => {
    EmpGrAddMemberStore.searchdata = {
      SEARCH_FIELD: "",
      SEARCH_VALUE: "",
    };
    EmpGrAddMemberStore.addCommonEmpVisible = false;
  },
  detailSearch: async () => {
    const copy = toJS(EmpGrAddMemberStore.commonTableData);
    const searchfield = toJS(EmpGrAddMemberStore.searchdata.SEARCH_FIELD);
    const searchvalue = toJS(EmpGrAddMemberStore.searchdata.SEARCH_VALUE);
    if (EmpGrAddMemberStore.isChecked) {
      const newdata = copy.filter((list) =>
        list[searchfield] === null
          ? console.log("null")
          : list[searchfield].includes(searchvalue)
      );
      EmpGrAddMemberStore.commonTableData = newdata;
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

      EmpGrAddMemberStore.commonTableData = copy;
    }
  },
  onChangeSearchValue: (e) => {
    EmpGrAddMemberStore.searchdata.SEARCH_VALUE = e.target.value;
  },
  onSelectSearchField: (value) => {
    EmpGrAddMemberStore.searchdata.SEARCH_FIELD = value;
  },
  onChangeCheck: (e) => {
    console.log(e.target.checked);
    EmpGrAddMemberStore.isChecked = e.target.checked;
    EmpGrAddMemberStore.searchdata.SEARCH_VALUE = null;
  },
});
export { EmpGrAddMemberStore };
