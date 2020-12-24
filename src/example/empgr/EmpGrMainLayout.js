import React, { useEffect } from "react";
import "antd/dist/antd.css";
import { Select, Space, Typography, Table, Button, Tree, Input } from "antd";
import { EmpGrMainStore } from "./EmpGrMainStore";
import { useObserver } from "mobx-react";
import { toJS } from "mobx";
import EmpGrMainColumn from "./EmpGrMainColumn.json";
import EmpGrAddMemberDialog from "./EmpGrAddMemberDialog";
import { EmpGrAddMemberStore } from "./EmpGrAddMemberStore";
import empgr from "../../components/empgr.css";
const { Option } = Select;
const { Title, Text } = Typography;

const EmpGrMainTitle = React.memo(() => {
  console.dir("EmpGrMainTitle");
  return (
    <>
      <Title style={{ marginTop: 30 }} level={4}>
        사원 그룹
      </Title>
    </>
  );
});
const EmpGrMainTreeField = React.memo(() => {
  return useObserver(() => (
    <>
      <Space direction="vertical">
        <Space>
          <Button onClick={EmpGrMainStore.changeToEGRKInsert}>
            사원그룹구분 +
          </Button>
        </Space>

        <Space>
          <Tree
            blockNode
            showLine
            treeData={[...EmpGrMainStore.treedata]}
            onSelect={EmpGrMainStore.onSelectTree}
          ></Tree>
        </Space>
      </Space>
    </>
  ));
});

const EmpGrMainInfoField = React.memo(() => {
  return useObserver(() => (
    <>
      <Space direction="vertical">
        <Space>
          {EmpGrMainStore.isEmpGroup ? null : EmpGrMainStore.selectedEGRKvalue !==
            "" ? (
            <Button onClick={EmpGrMainStore.changeToEGRInsert}>
              하위 사원그룹추가
            </Button>
          ) : null}
          <Button onClick={EmpGrMainStore.changeToUpdate}>수정</Button>
          <Button onClick={EmpGrMainStore.deleteEmpGroup}>삭제</Button>
        </Space>
        {EmpGrMainStore.isEmpGroup ? (
          <Space>
            <Text>사원그룹명:</Text>
            <Text>{EmpGrMainStore.selecteddata.EMPGR_NM}</Text>
          </Space>
        ) : null}
        <Space>
          <Text>사원그룹구분명:</Text>
          <Text>{EmpGrMainStore.selecteddata.EMPGR_KIND_NM}</Text>
        </Space>
        <Space>
          <Text>비고:</Text>
          {EmpGrMainStore.isEmpGroup ? (
            <Text>{EmpGrMainStore.selecteddata.EMPGR_COMMENT}</Text>
          ) : (
            <Text>{EmpGrMainStore.selecteddata.EMPGR_KIND_COMMENT}</Text>
          )}
        </Space>
        <Space>
          <Text>생성자:</Text>
          <Text>{EmpGrMainStore.selecteddata.CREATOR_NM}</Text>
        </Space>
        <Space>
          <Text>생성일:</Text>
          <Text>{EmpGrMainStore.selecteddata.CREATE_TS}</Text>
        </Space>
      </Space>
    </>
  ));
});

const EmpGrMainInfoFieldInsert = React.memo(() => {
  return useObserver(() => (
    <>
      <Space direction="vertical">
        <Space>
          <Button onClick={EmpGrMainStore.onClickSaveInsert}>저장</Button>
          <Button>취소</Button>
        </Space>
        {EmpGrMainStore.isEmpGroup ? (
          <Space>
            <Text>사원그룹명:</Text>
            <Input
              name="EMPGR_NM"
              onChange={EmpGrMainStore.changeEmpGroupInput}
            ></Input>
          </Space>
        ) : null}
        <Space>
          <Text>사원그룹구분명:</Text>
          {EmpGrMainStore.isEmpGroup ? (
            <Text>{EmpGrMainStore.selecteddata.EMPGR_KIND_NM}</Text>
          ) : (
            <Input
              name="EMPGR_KIND_NM"
              onChange={EmpGrMainStore.chagneEmpGroupKindInput}
            ></Input>
          )}
        </Space>
        <Space>
          <Text>비고:</Text>
          {EmpGrMainStore.isEmpGroup ? (
            <Input
              name="EMPGR_COMMENT"
              onChange={EmpGrMainStore.changeEmpGroupInput}
            ></Input>
          ) : (
            <Input
              name="EMPGR_KIND_COMMENT"
              onChange={EmpGrMainStore.chagneEmpGroupKindInput}
            ></Input>
          )}
        </Space>
      </Space>
    </>
  ));
});

const EmpGrMainInfoFieldUpdate = React.memo(() => {
  return useObserver(() => (
    <>
      <Space direction="vertical">
        <Space>
          <Button onClick={EmpGrMainStore.onClickSaveUpdate}>저장</Button>
          <Button>취소</Button>
        </Space>
        {EmpGrMainStore.isEmpGroup ? (
          <Space>
            <Text>사원그룹명:</Text>
            <Input
              name="EMPGR_NM"
              onChange={EmpGrMainStore.changeEmpGroupInput}
              defaultValue={EmpGrMainStore.selecteddata.EMPGR_NM}
            ></Input>
          </Space>
        ) : null}
        <Space>
          <Text>사원그룹구분명:</Text>
          {EmpGrMainStore.isEmpGroup ? (
            <Select
              onSelect={EmpGrMainStore.selectEmpGroupInput}
              style={{ width: 200 }}
              defaultValue={EmpGrMainStore.empgrInput.EMPGR_KIND}
            >
              {EmpGrMainStore.fulldata.map((list) => (
                <Option key={list.EMPGR_KIND} value={list.EMPGR_KIND}>
                  {list.EMPGR_KIND_NM}
                </Option>
              ))}
            </Select>
          ) : (
            <Input
              name="EMPGR_KIND_NM"
              onChange={EmpGrMainStore.chagneEmpGroupKindInput}
              defaultValue={EmpGrMainStore.selecteddata.EMPGR_KIND_NM}
            ></Input>
          )}
        </Space>
        <Space>
          <Text>비고:</Text>
          {EmpGrMainStore.isEmpGroup ? (
            <Input
              name="EMPGR_COMMENT"
              onChange={EmpGrMainStore.changeEmpGroupInput}
              defaultValue={EmpGrMainStore.selecteddata.EMPGR_COMMENT}
            ></Input>
          ) : (
            <Input
              name="EMPGR_KIND_COMMENT"
              onChange={EmpGrMainStore.chagneEmpGroupKindInput}
              defaultValue={EmpGrMainStore.selecteddata.EMPGR_KIND_COMMENT}
            ></Input>
          )}
        </Space>
        <Space>
          <Text>생성자:</Text>
          <Text>{EmpGrMainStore.selecteddata.CREATOR_NM}</Text>
        </Space>
        <Space>
          <Text>생성일:</Text>
          <Text>{EmpGrMainStore.selecteddata.CREATE_TS}</Text>
        </Space>
      </Space>
    </>
  ));
});

const EmpGrMainTableField = React.memo(() => {
  return useObserver(() => (
    <>
      {EmpGrMainStore.isEmpGroup ? (
        <Space direction="vertical">
          <Space>
            {EmpGrMainStore.actiontype !== "R" ? (
              <Space direction="vertical">
                <Text>사원그룹멤버</Text>
                <Space direction="horizontal">
                  <Button onClick={EmpGrMainStore.showModal}>추가</Button>
                  <Button onClick={EmpGrMainStore.deleteRow}>삭제</Button>
                </Space>
              </Space>
            ) : null}
          </Space>
          <Space>
            <Table
              columns={EmpGrMainColumn}
              rowSelection={{
                type: "checkbox",
                onChange: (selectedRowKeys, selectedRows) => {
                  console.dir(selectedRows);
                  EmpGrMainStore.checkedData = selectedRows;
                },
              }}
              dataSource={[...EmpGrMainStore.tabledata]}
            />
            {EmpGrAddMemberStore.addCommonEmpVisible ? (
              <EmpGrAddMemberDialog />
            ) : null}
          </Space>
        </Space>
      ) : null}
    </>
  ));
});

const EmpGrMainLayout = () => {
  console.dir("EmpGrMainLayout");
  useEffect(() => EmpGrMainStore.onMount(), []);

  return useObserver(() =>
    //로딩중인 경우 return 할 컴포넌트
    EmpGrMainStore.loading ? (
      <div>로딩중...</div>
    ) : //에러발생한 경우 return 할 컴포넌트
    EmpGrMainStore.error ? (
      <div>에러발생</div>
    ) : (
      <>
        <Space direction="vertical">
          <Space>
            <EmpGrMainTitle />
          </Space>
          <Space direction="horizontal" align="start">
            <Space className="TreeLayout" align="start">
              <EmpGrMainTreeField />
            </Space>
            <Space direction="vertical">
              <Space className="InfoLayout" align="start">
                {EmpGrMainStore.actiontype === "U" ? (
                  <EmpGrMainInfoFieldUpdate />
                ) : EmpGrMainStore.actiontype === "I" ? (
                  <EmpGrMainInfoFieldInsert />
                ) : (
                  <EmpGrMainInfoField />
                )}
              </Space>
              <Space className="TableLayout" align="start">
                <EmpGrMainTableField />
              </Space>
            </Space>
          </Space>
        </Space>
      </>
    )
  );
};

export default React.memo(EmpGrMainLayout);
