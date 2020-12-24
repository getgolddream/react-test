import React, {useReducer, useState, useEffect} from 'react';
import {Space} from "antd";
import axios from "axios";
import Table from '/src/hr/components/Table';
import Select from '/src/hr/components/Select';
import Input from '/src/hr/components/Input';
import Button from '/src/hr/components/Button';
import Image from '/src/hr/components/Image';
import Title from '/src/layout/Title';

function SkillDetailUpdate(){


    return(
        <Space direction='vertical'>
            <Space>
                <b>역량명</b>
                <Input value={'agwegwea'} />
            </Space>
            <Space>
                <b>역량명</b>
                <Input readOnly={isRead} value={'agwegwea'} />
            </Space>    
        </Space>
    )
}

export default SkillDetailUpdate;