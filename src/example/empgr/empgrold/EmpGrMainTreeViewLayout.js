import { Tree, Input, Button, Menu, Dropdown } from "antd";
import Axios from "axios";
import React, { useEffect, useReducer, useCallback } from "react";
import EmpGroupKindDialog from "./EmpGroupKindDialog";
import EmpGroupDialog from "./EmpGroupDialog";
const { Search } = Input;

const EmpGrTreeviewReducer = (state, action) => {
  const { type, ...rest } = action;
  switch (type) {
    case "SET_STATE":
      return { ...state, ...rest };
    default:
      return state;
  }
};

function EmpGrMainTreeViewLayout({
  mainState,
  onFullMount,
  EmpGrMainPageDispatch,
}) {
  const [state, EmpGrTreeviewDispatch] = useReducer(EmpGrTreeviewReducer, {
    searchSet: {
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
    },
    empGrTreeData: [],
  });
  const {
    empgrFullData,
    egrkVisible,
    egrVisible,
    selectedData,
    clickStatus,
  } = mainState;
  const { searchSet, empGrTreeData } = state;
  const { expandedKeys, searchValue, autoExpandParent } = searchSet;

  const menu = (
    <Menu onClick={DropDownClick}>
      <Menu.Item key="egradd">하위사원그룹추가</Menu.Item>
      <Menu.Item key="egrdelete">2nd menu item</Menu.Item>
    </Menu>
  );

  const onMount = async () => {
    console.log("onMount");
    console.log(empgrFullData);
    var newtemplist = empgrFullData.map((templist) => ({
      key: templist.EMPGR_KIND,
      searchkeyword: templist.EMPGR_KIND_NM,
      name: "EMPGR_KIND",
      dto: templist,
      title: (
        <div style={{ maxWidth: "100%" }}>
          <div style={{ float: "left" }}>
            <h5>{templist.EMPGR_KIND_NM}</h5>
          </div>
          <div style={{ float: "right" }}>
            <Dropdown.Button overlay={menu}></Dropdown.Button>
          </div>
        </div>
      ),
      children:
        templist.EmpGroupList === null
          ? null
          : templist.EmpGroupList.map((list) => ({
              key: list.EMPGR_CD,
              searchkeyword: list.EMPGR_NM,
              parent: list.EMPGR_KIND,
              name: "EMPGR",
              dto: list,
              title: <h5>{list.EMPGR_NM}</h5>,
            })),
    }));
    EmpGrTreeviewDispatch({
      type: "SET_STATE",
      empGrTreeData: [...newtemplist],
    });
  };
  useEffect(() => {
    onMount();
  }, [empgrFullData]);

  const onSearchChange = (value) => {
    var keys = [];
    var node = [];

    empGrTreeData.map((item) => {
      console.log(value);
      console.log(item);
      if (item.children !== null) {
        item.children.map((child) => {
          if (child.searchkeyword.indexOf(value) > -1) {
            keys.push(child.parent);
            node.push(child);
          }
        });
      }
    });
    EmpGrTreeviewDispatch({
      type: "SET_STATE",
      empGrTreeData: [...empGrTreeData],
      searchSet: {
        expandedKeys: keys,
        searchValue: value,
        autoExpandParent: true,
      },
    });
  };
  const onExpand = (item) => {
    EmpGrTreeviewDispatch({
      type: "SET_STATE",
      searchSet: {
        expandedKeys: [...item],
        autoExpandParent: true,
      },
    });
  };
  const showErgkModal = () => {
    console.log("showErgkModal_treeview");
    EmpGrMainPageDispatch({
      type: "SET_STATE",
      actionStatus: "I",
      egrkVisible: true,
    });
  };
  function DropDownClick(e) {
    if (e.key === "egradd") {
      EmpGrMainPageDispatch({
        type: "SET_STATE",
        actionStatus: "I",
        egrVisible: true,
      });
    }
  }
  const onSelectTree = (selectedKeys, nodeinfo) => {
    EmpGrMainPageDispatch({
      type: "SET_STATE",
      selectedData: nodeinfo.node.dto,
      clickStatus: nodeinfo.node.name,
    });
  };
  return (
    <div>
      <Button onClick={showErgkModal}>+</Button>
      <Search placeholder="Search" onSearch={onSearchChange} />
      <Tree
        style={{ marginTop: "8px" }}
        id="myegrtree"
        blockNode
        onSelect={onSelectTree}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={empGrTreeData}
      ></Tree>
      {egrkVisible ? (
        <EmpGroupKindDialog
          EmpGrMainPageDispatch={EmpGrMainPageDispatch}
          mainState={mainState}
          onFullMount={onFullMount}
        />
      ) : null}
      {egrVisible ? (
        <EmpGroupDialog
          EmpGrMainPageDispatch={EmpGrMainPageDispatch}
          mainState={mainState}
          onFullMount={onFullMount}
        />
      ) : null}
    </div>
  );
}

export default EmpGrMainTreeViewLayout;
