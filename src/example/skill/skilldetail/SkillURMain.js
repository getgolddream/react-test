import React, {useReducer, useState, useEffect} from 'react';
import {Space} from "antd";
import axios from "axios";
import Table from '/src/hr/components/Table';
import Select from '/src/hr/components/Select';
import Input from '/src/hr/components/Input';
import Button from '/src/hr/components/Button';
import Image from '/src/hr/components/Image';
import Title from '/src/layout/Title';


/*
작성자: 이한빈(hanbeen_lee@tmax.co.kr)
작성일: 20201127
설명: 역량 상세조회와 수정을 위한 페이지 컴포넌트
      상세조회에서 수정을 왔다갔다 할 수 있도록 컴포넌트를 구성
      조회와 수정을 하나의 컴포넌트로 한 이유는 불러온 데이터 상태는 동일하고 텍스트만 리드온리냐 편집할 수 있냐의 차이 
*/

function mainReducer(state, action){

    switch(action.type){
        case 'TransferPageType' :
            return{
                ...state,
                isRead : !state.isRead
            };
        default:
            throw new Error(`처음보는 유형입니다 이것은 ${action.type}`)
    }
};



function SkillDetailUR(){
    console.log("adsf");
    const [state, mainDispatch] = useReducer(mainReducer, {
        loading: false,
        error: null,
        skillDetailData: null,
        skillLevelData: null,
        isRead:true
        });
    
    // true이면 조회페이지 false이면 수정페이지
    const isRead = state.isRead;
   
    //isRead는 state로 놓고 title은 let으로 놓아서 상태바뀌면 title과 description이 다시 세팅 되도록 하자
    let title= isRead ? '역량 상세 정보' : '역량 수정'
    let description= isRead ? '역량 상세 내용을 조회합니다' : '역량 내용들을 수정합니다'
    
    //state의 isRead속성을 바꿔서 조회는 수정으로, 수정은 조회로 변경
    const changePageType = () =>{
        mainDispatch({type: 'TransferPageType'});
        console.log('easdf');
    }

    
    //isRead에 따라 버튼레이아웃 모양 바뀌도록 (조회에서는 수정, 삭제. 수정에서는 저장, 취소)
    let buttonLayer = isRead ?
    (
        <Space>
            {/*TODO: Link를 통해서 이전 페이지로 넘어가야함  */}
            <Button onClick={changePageType}>수정</Button>
            <Button>삭제</Button>
        </Space>
    ) :
    (
        <Space>
            {/*저장 누를 때는 State값도 바꾸어 주면서 전환하고 취소에서는 state 안 바뀌고 전환하는 걸로 */}
            <Button onClick={changePageType}>저장</Button>
            <Button onClick={changePageType}>취소</Button>
        </Space>
    )


    return(
        <Space direction='vertical'>
            <Space>
                <Title title = {title} description = {description} />
            </Space>
            {buttonLayer}
            <Space>
                여기는 SkillDetail이 들어갈 부분
            </Space>
            <Space>
                여기는 SkillLevel이 들어갈 부분
            </Space>
            
        </Space>
        
    );
}

export default SkillDetailUR;