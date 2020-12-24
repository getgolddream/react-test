import React, { useEffect } from "react";
import "antd/dist/antd.css";
import { Typography, Button, Space } from "antd";
import { useObserver } from "mobx-react";
import { OrgChartStore } from "./OrgChartStore";
const { Title, Text } = Typography;
const OrgChartMainTitle = React.memo(() => {
  console.dir("OrgChartMainTitle");
  return (
    <>
      <Space direction="vertical">
        <Title style={{ marginTop: 30 }} level={4}>
          조직도조회
        </Title>
        <Text> 조직도를 조회하는 페이지 입니다. </Text>
        <Button type="primary" style={{ width: 100 }}>
          조회
        </Button>
      </Space>
    </>
  );
});

const OrgChartMain = () => {
  console.dir("OrgChartMainLayout");
  useEffect(() => OrgChartStore.onMount(), []);

  return useObserver(() =>
    //로딩중인 경우 return 할 컴포넌트
    OrgChartStore.loading ? (
      <div>로딩중...</div>
    ) : //에러발생한 경우 return 할 컴포넌트
    OrgChartStore.error ? (
      <div>에러발생</div>
    ) : (
      <>
        <OrgChartMainTitle />
      </>
    )
  );
};

export default React.memo(OrgChartMain);
