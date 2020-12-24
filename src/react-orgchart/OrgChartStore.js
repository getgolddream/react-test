import { observable, toJS } from "mobx";

const OrgChartStore = observable({
  loading: false,
  error: false,

  //페이지 로딩시 호출되는 기본 setting 함수
  onMount: async () => {
    console.dir("onMount: page");
    try {
      OrgChartStore.loading = true;
      OrgChartStore.error = null;
    } catch (e) {
      OrgChartStore.error = e;
    }
    OrgChartStore.loading = false;
  },
});

export { OrgChartStore };
