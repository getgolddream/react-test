import { observable, toJS } from "mobx";
import { HR_APP } from "../../GlobalVariables";
import { WorkPeriodMainStore } from "./WorkPeriodMainStore";

import Axios from "axios";
const workPeriodEditOne = {
  key: 0,
  EMP_ID: "",
  EMP_NM_KOR: "",
  WORK_PERIOD_EDIT_ID: "",
  WORK_PERIOD_EDIT_KIND: "",
  WORK_PERIOD_EDIT_KIND_NM: "",
  WORK_PERIOD_EDIT_YEARS: "",
  WORK_PERIOD_EDIT_MONTHS: "",
  WORK_PERIOD_EDIT_DAYS: "",
  WORK_PERIOD_EDIT_TOTALDAYS: "",
  WORK_PERIOD_EDIT_COMMENT: "",
  CUD_CHECKER: "I",
};
const WorkPeriodEditStore = observable({
  workPeriodEditList: [workPeriodEditOne],
  workPeriodEditInput: [workPeriodEditOne],
  loading: false,
  error: false,
  keyindex: 1,
  isUpdate: false,
  onMount: async () => {
    console.dir("WorkPeriodEditStore");
    try {
      WorkPeriodEditStore.loading = true;
      WorkPeriodEditStore.error = null;
      console.log(toJS(WorkPeriodMainStore.checkedEmp));

      const result = await Axios.put(
        `${HR_APP}/Employee/ReadEmpWorkPeriodEditList?action=SO`,
        {
          dto: { WorkPeriodEditList: WorkPeriodMainStore.checkedEmp },
        }
      );
      let copy = result.data.dto.EmpWorkPeriodEditList[0].WorkPeriodEditList;
      console.log(copy);
      copy.map((list) => (list.CUD_CHECKER = "U"));
      WorkPeriodEditStore.workPeriodEditList = copy;
      WorkPeriodEditStore.workPeriodEditInput = copy;
    } catch (e) {
      WorkPeriodEditStore.error = e;
    }
    WorkPeriodEditStore.loading = false;
  },

  onChangeWorkPeriodEditKind: (value, info, index) => {
    console.log(value);
    console.log(toJS(info));
    console.log(index);
    WorkPeriodEditStore.workPeriodEditInput[
      index
    ].WORK_PERIOD_EDIT_KIND = value;
  },
  addRow: () => {
    workPeriodEditOne.key = WorkPeriodEditStore.keyindex;
    WorkPeriodEditStore.workPeriodEditList.push(workPeriodEditOne);
    WorkPeriodEditStore.workPeriodEditInput.push(workPeriodEditOne);
    WorkPeriodEditStore.keyindex += 1;
    console.log(toJS(WorkPeriodEditStore.workPeriodEditList));
  },
  onChangeYear: (value, index) => {
    WorkPeriodEditStore.workPeriodEditInput[
      index
    ].WORK_PERIOD_EDIT_YEARS = value;
  },
  onChangeMonth: (value, index) => {
    WorkPeriodEditStore.workPeriodEditInput[
      index
    ].WORK_PERIOD_EDIT_MONTHS = value;
  },
  onChangeDay: (value, index) => {
    WorkPeriodEditStore.workPeriodEditInput[
      index
    ].WORK_PERIOD_EDIT_DAYS = value;
  },
  onChangeComment: (e, index) => {
    const { name, value } = e.target;
    WorkPeriodEditStore.workPeriodEditInput[
      index
    ].WORK_PERIOD_EDIT_COMMENT = value;
  },
  handleOk: async () => {
    console.log("handleok");
    await Axios.put(`${HR_APP}/Employee/CUDWorkPeriodEditList?action=SO`, {
      dto: { WorkPeriodEditList: WorkPeriodEditStore.workPeriodEditInput },
    });

    setTimeout(() => {
      WorkPeriodMainStore.editModalVisible = false;
    }, 1000);
  },
  handleCancel: () => {
    WorkPeriodMainStore.editModalVisible = false;
  },
  onRowDelete: (e, index) => {
    console.log(index);
    if (WorkPeriodEditStore.workPeriodEditInput[index].CUD_CHECKER === "I") {
      WorkPeriodEditStore.workPeriodEditInput.splice(index, 1);
    } else {
      WorkPeriodEditStore.workPeriodEditInput[index].CUD_CHECKER === "D";
    }
    WorkPeriodEditStore.workPeriodEditList.splice(index, 1);
  },
});
export { WorkPeriodEditStore };
