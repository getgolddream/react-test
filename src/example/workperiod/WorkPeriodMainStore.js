import { observable, toJS } from "mobx";
import axios from "axios";
import { HR_APP } from "../../GlobalVariables";
import { WorkPeriodEditStore } from "./WorkPeriodEditStore";
const WorkPeriodMainStore = observable({
  workperiodlist: [],
  checkedEmp: [],
  loading: false,
  error: false,
  editModalVisible: false,
  searchCondition: {
    ORG_CD: "ORGN202004230136",
    WORK_PERIOD_EDDT: "20201212",
  },
  filterlist: [
    { index: 0, check: true },
    { index: 1, check: true },
    { index: 2, check: true },
    { index: 3, check: true },
    { index: 4, check: true },
    { index: 5, check: true },
    { index: 6, check: true },
    { index: 7, check: true },
    { index: 8, check: true },
  ],

  onMount: async () => {
    console.dir("WorkPeriodMainStore");
    try {
      WorkPeriodMainStore.loading = true;
      WorkPeriodMainStore.error = null;
      const result = await axios.post(
        `${HR_APP}/Employee/ReadAllEmpWorkPeriodList?action=SO`,
        {
          dto: WorkPeriodMainStore.searchCondition,
        }
      );
      console.log(result);
      WorkPeriodMainStore.workperiodlist = result.data.dto.WorkPeriodList;
    } catch (e) {
      WorkPeriodMainStore.error = e;
    }
    WorkPeriodMainStore.loading = false;
  },
  editModalOpen: () => {
    WorkPeriodEditStore.isUpdate = true;
    WorkPeriodMainStore.editModalVisible = true;
  },
  openEditDetail: (record) => {
    WorkPeriodEditStore.isUpdate = false;
    WorkPeriodMainStore.editModalVisible = true;
    WorkPeriodMainStore.checkedEmp = [record];
    console.log(toJS(WorkPeriodMainStore.checkedEmp));
  },
  checkBoxClick: (e, index) => {
    console.log(index);
    // WorkPeriodMainStore.filterlist.index = e.target.checked;
    WorkPeriodMainStore.filterlist[index].check = e.target.checked;
    console.log(toJS(WorkPeriodMainStore.filterlist));
  },
});
export { WorkPeriodMainStore };
