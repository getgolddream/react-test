import { observable, toJS } from "mobx";
import axios from "axios";
import { HR_APP } from "../../GlobalVariables";

const DispatchMainStore = observable({
  disKindSBList: [],
  disApprSBList: [],
  disTableData: [],
  searchData: {},
  checkedData: [],
  loading: false,
  error: false,

  //페이지 로딩시 호출되는 기본 setting 함수
  onMount: async () => {
    console.dir("onMount: page");
    try {
      DispatchMainStore.loading = true;
      DispatchMainStore.error = null;
      const sbdata = await axios.get(
        `${HR_APP}/Employee/ReadDispatchSBAll?action=SO`
      );
      const tabledata = await axios.get(
        `${HR_APP}/Employee/ReadDispatchGroupList?action=SO`
      );
      console.log(sbdata);
      console.log(tabledata);
      DispatchMainStore.disKindSBList =
        sbdata.data.dto.DispatchSbKindList[0].DispatchSBList; //[검색조건1.]발령구분 셀렉트박스데이터세팅
      DispatchMainStore.disApprSBList =
        sbdata.data.dto.DispatchSBApprList[0].DispatchSBList; //[검색조건2.]승인상태 셀렉트박스데이터세팅

      DispatchMainStore.disTableData = tabledata.data.dto.DispatchGroupList; //발령테이블데이터세팅
    } catch (e) {
      DispatchMainStore.error = e;
    }
    DispatchMainStore.loading = false;
  },
  onDiskindChoice: (value, list) => {
    console.dir("발령구분 검색조건선택");
    DispatchMainStore.searchData.DISPATCH_KIND = value;
  },
  onApprChoice: (value, list) => {
    console.dir("승인상태 검색조건선택");
    DispatchMainStore.searchData.DISPATCH_APPR_STATUS = value;
  },
  onStdtChoice: (list, value) => {
    console.dir("시작일 검색조건선택");
    DispatchMainStore.searchData.SEARCH_STDT = value;
  },
  onEddtChoice: (list, value) => {
    console.dir("종료일 검색조건선택");
    DispatchMainStore.searchData.SEARCH_EDDT = value;
  },
  //검색 버튼 onClick
  onClickSearch: async (value) => {
    console.dir("onClickSearch");
    let copy = [];
    try {
      DispatchMainStore.error = null;
      const response = await axios.put(
        `${HR_APP}/Employee/ReadDispatchGroupList?action=SO`,
        {
          dto: DispatchMainStore.searchData,
        }
      );

      copy = response.data.dto.DispatchGroupList;
      console.log(copy);
      DispatchMainStore.disTableData = copy === null ? [] : copy;
    } catch (e) {
      DispatchMainStore.error = e;
    }
  },

  onClickDelete: async () => {
    console.log(DispatchMainStore.checkedData);
    try {
      const response = await axios.put(
        `${HR_APP}/Employee/DeleteDispatchGroupList?action=SO`,
        {
          dto: { DispatchGroupList: DispatchMainStore.checkedData },
        }
      );
      DispatchMainStore.onClickSearch();
    } catch (e) {
      DispatchMainStore.error = e;
    }
  },
});

export { DispatchMainStore };
