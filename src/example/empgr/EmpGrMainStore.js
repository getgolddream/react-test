import { observable, toJS } from "mobx";
import axios from "axios";
import { HR_APP, HR_USER } from "../../GlobalVariables";
import { EmpGrAddMemberStore } from "./EmpGrAddMemberStore";

const EmpGrMainStore = observable({
  loading: false,
  error: false,
  fulldata: [{ EMPGR_KIND: "", EMPGR_KIND_NM: "", EmpGroupList: null }],
  treedata: [],
  selecteddata: {},
  tabledata: [],
  isEmpGroup: false,
  actiontype: "R",
  selectedEGRKvalue: "",
  selectedEGRvalue: "",
  checkedData: [],
  empgrInput: {
    EMPGR_CD: "",
    EMPGR_NM: "",
    EMPGR_COMMENT: "",
    EMPGR_KIND: "",
    CREATOR_ID: HR_USER,
    MODIFIER_ID: HR_USER,
  },
  empgrKindInput: {
    EMPGR_KIND: "",
    EMPGR_KIND_NM: "",
    EMPGR_KIND_COMMENT: "",
    CREATOR_ID: HR_USER,
    MODIFIER_ID: HR_USER,
  },

  //페이지 로딩시 호출되는 기본 setting 함수
  onMount: async () => {
    console.dir("onMount: page");
    try {
      EmpGrMainStore.loading = true;
      EmpGrMainStore.error = null;
      const result = await axios.get(
        `${HR_APP}/Employee/ReadEmpGroupFullList?action=SO`
      );
      let copy = result.data.dto.EmpGroupKindList;

      copy === null
        ? null
        : ((EmpGrMainStore.fulldata = copy),
          (EmpGrMainStore.treedata = copy.map((list) => ({
            key: list.EMPGR_KIND,
            title: list.EMPGR_KIND_NM,
            name: "EGRK",
            data: list,
            children:
              list.EmpGroupList !== null
                ? list.EmpGroupList.map((child) => ({
                    key: child.EMPGR_CD,
                    title: child.EMPGR_NM,
                    name: "EGR",
                    data: child,
                  }))
                : null,
          }))));
    } catch (e) {
      EmpGrMainStore.error = e;
    }
    EmpGrMainStore.loading = false;
  },
  onSelectTree: (selectedKeys, nodeinfo) => {
    EmpGrMainStore.tabledata = [];
    EmpGrMainStore.selecteddata = nodeinfo.node.data;
    EmpGrMainStore.actiontype = "R";
    console.log(toJS(EmpGrMainStore.selecteddata.EmpGroupEmpList));
    nodeinfo.node.name === "EGR"
      ? ((EmpGrMainStore.isEmpGroup = true),
        EmpGrMainStore.selecteddata.EmpGroupEmpList === null
          ? (EmpGrMainStore.tabledata = [])
          : ((EmpGrMainStore.tabledata =
              EmpGrMainStore.selecteddata.EmpGroupEmpList),
            (EmpGrMainStore.selectedEGRvalue = selectedKeys[0]),
            (EmpGrMainStore.empgrInput = EmpGrMainStore.selecteddata)))
      : ((EmpGrMainStore.isEmpGroup = false),
        (EmpGrMainStore.selectedEGRKvalue = selectedKeys[0]),
        (EmpGrMainStore.empgrKindInput = EmpGrMainStore.selecteddata));
  },
  showModal: () => {
    EmpGrAddMemberStore.isEmpGrType = false;
    EmpGrAddMemberStore.originalTableData = EmpGrMainStore.tabledata;
    EmpGrAddMemberStore.addCommonEmpVisible = true;
  },
  changeToUpdate: () => {
    EmpGrMainStore.isEmpGroup
      ? (EmpGrMainStore.empgrInput = EmpGrMainStore.selecteddata)
      : (EmpGrMainStore.empgrKindInput = EmpGrMainStore.selecteddata);
    EmpGrMainStore.actiontype = "U";
  },
  changeToEGRKInsert: () => {
    EmpGrMainStore.actiontype = "I";
    EmpGrMainStore.isEmpGroup = false;
  },
  changeToEGRInsert: () => {
    EmpGrMainStore.actiontype = "I";
    EmpGrMainStore.isEmpGroup = true;
  },
  changeEmpGroupInput: (e) => {
    const { name, value } = e.target;
    EmpGrMainStore.empgrInput[name] = value;
  },
  chagneEmpGroupKindInput: (e) => {
    const { name, value } = e.target;
    EmpGrMainStore.empgrKindInput[name] = value;
  },
  selectEmpGroupInput: (value) => {
    EmpGrMainStore.empgrInput["EMPGR_KIND"] = value;
  },
  deleteRow: () => {
    let tabledata = EmpGrMainStore.tabledata;
    let checkdata = EmpGrMainStore.checkedData;
    console.log(toJS(checkdata));
    for (let i in checkdata) {
      tabledata = tabledata.filter(
        (list) => list["EMP_ID"] !== checkdata[i]["EMP_ID"]
      );
    }
    EmpGrMainStore.tabledata = tabledata;
  },
  onClickSaveUpdate: async () => {
    {
      if (EmpGrMainStore.isEmpGroup) {
        EmpGrMainStore.empgrInput.MODIFIER_ID = HR_USER;
        EmpGrMainStore.empgrInput.EMPGR_KIND =
          EmpGrMainStore.empgrInput.EMPGR_KIND;
        let dbdata = toJS(EmpGrMainStore.selecteddata.EmpGroupEmpList);
        EmpGrMainStore.tabledata.map(
          (list) => (list["EMPGR_CD"] = EmpGrMainStore.empgrInput.EMPGR_CD)
        );
        let tabledata = toJS(EmpGrMainStore.tabledata);

        let insertlist = [];
        let deletelist = [];
        for (let i in dbdata) {
          tabledata.findIndex((list) => list.EMP_ID === dbdata[i].EMP_ID) < 0
            ? deletelist.push(dbdata[i])
            : null;
        }
        for (let i in tabledata) {
          dbdata.findIndex((list) => list.EMP_ID === tabledata[i].EMP_ID) < 0
            ? insertlist.push(tabledata[i])
            : null;
        }
        console.log(toJS(EmpGrMainStore.empgrInput));
        console.log(insertlist);
        console.log(deletelist);
        await axios.post(`${HR_APP}/Employee/UpdateEmpGroup?action=SO`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          dto: EmpGrMainStore.empgrInput,
        });
        deletelist.length !== 0
          ? await axios.post(`${HR_APP}/Employee/DeleteEmpMember?action=SO`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              dto: {
                EmpGroupEmpList: deletelist,
              },
            })
          : null;
        insertlist.length !== 0
          ? await axios.post(
              `${HR_APP}/Employee/InsertEmpGroupEmpList?action=SO`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                dto: {
                  EmpGroupEmpList: insertlist,
                },
              }
            )
          : null;
        console.log(toJS(EmpGrMainStore.empgrInput.EMPGR_KIND));

        await EmpGrMainStore.onMount();
        let temp = EmpGrMainStore.fulldata.filter(
          (list) => list.EMPGR_KIND === EmpGrMainStore.empgrInput.EMPGR_KIND
        );
        let listdata = temp[0].EmpGroupList.filter(
          (list) => list.EMPGR_CD === EmpGrMainStore.empgrInput.EMPGR_CD
        );
        EmpGrMainStore.selecteddata = listdata[0];
        EmpGrMainStore.actiontype = "R";
      } else {
        EmpGrMainStore.empgrKindInput.MODIFIER_ID = HR_USER;
        await axios.post(`${HR_APP}/Employee/UpdateEmpGroupKind?action=SO`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          dto: EmpGrMainStore.empgrKindInput,
        });
        await EmpGrMainStore.onMount();
        let temp = EmpGrMainStore.fulldata.filter(
          (list) => list.EMPGR_KIND === EmpGrMainStore.empgrKindInput.EMPGR_KIND
        );
        EmpGrMainStore.selecteddata = temp[0];
        EmpGrMainStore.actiontype = "R";
      }
    }
  },
  onClickSaveInsert: async () => {
    if (EmpGrMainStore.isEmpGroup) {
      //1. 사원그룹 insert.
      EmpGrMainStore.empgrInput.CREATOR_ID = HR_USER;
      EmpGrMainStore.empgrInput.MODIFIER_ID = HR_USER;
      EmpGrMainStore.empgrInput.EMPGR_KIND = EmpGrMainStore.selectedEGRKvalue;
      console.log(toJS(EmpGrMainStore.empgrInput));

      const result = await axios.post(
        `${HR_APP}/Employee/InsertEmpGroup?action=SO`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          dto: EmpGrMainStore.empgrInput,
        }
      );
      //2. 사원그룹멤버 dto에 사원그룹cd 추가.
      let tableInput = EmpGrMainStore.tabledata;
      tableInput.map(
        (list) => (
          (list.EMPGR_CD = result.data.dto.EMPGR_CD),
          (list.CREATOR_ID = HR_USER),
          (list.MODIFIER_ID = HR_USER)
        )
      );
      //3. 사원그룹멤버 추가.
      await axios.post(`${HR_APP}/Employee/InsertEmpGroupEmpList?action=SO`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        dto: {
          EmpGroupEmpList: tableInput,
        },
      });
      await EmpGrMainStore.onMount();

      let egrkdata = EmpGrMainStore.fulldata.filter(
        (list) => list.EMPGR_KIND === EmpGrMainStore.empgrInput.EMPGR_KIND
      );
      let egrdata = egrkdata[0].EmpGroupList.filter(
        (list) => list.EMPGR_CD === result.data.dto.EMPGR_CD
      );
      EmpGrMainStore.selecteddata = egrdata[0];
      EmpGrMainStore.actiontype = "R";
    } else {
      EmpGrMainStore.empgrKindInput.CREATOR_ID = HR_USER;
      EmpGrMainStore.empgrKindInput.MODIFIER_ID = HR_USER;
      const result = await axios.post(
        `${HR_APP}/Employee/InsertEmpGroupKind?action=SO`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          dto: EmpGrMainStore.empgrKindInput,
        }
      );
      console.log(result.data.dto.EMPGR_KIND);
      await EmpGrMainStore.onMount();
      let egrkdata = EmpGrMainStore.fulldata.filter(
        (list) => list.EMPGR_KIND === result.data.dto.EMPGR_KIND
      );
      EmpGrMainStore.selecteddata = egrkdata[0];
      EmpGrMainStore.actiontype = "R";
    }
  },
  deleteEmpGroup: async () => {
    if (EmpGrMainStore.isEmpGroup) {
      await axios.post(`${HR_APP}/Employee/DeleteEmpGroup?action=SO`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        dto: { EMPGR_CD: EmpGrMainStore.selectedEGRvalue },
      });
      await EmpGrMainStore.onMount();
      let egrkdata = EmpGrMainStore.fulldata.filter(
        (list) => list.EMPGR_KIND === EmpGrMainStore.empgrInput.EMPGR_KIND
      );
      EmpGrMainStore.selecteddata = egrkdata[0];
      EmpGrMainStore.tabledata = [];
      EmpGrMainStore.isEmpGroup = false;
    } else {
      await axios.post(`${HR_APP}/Employee/DeleteEmpGroupKind?action=SO`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        dto: { EMPGR_KIND: EmpGrMainStore.selectedEGRKvalue },
      });
      await EmpGrMainStore.onMount();
      EmpGrMainStore.selecteddata = {
        EMPGR_KIND_NM: "",
        EMPGR_KIND_COMMENT: "",
      };
    }
  },
});

export { EmpGrMainStore };
