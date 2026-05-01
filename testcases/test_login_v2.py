"""
登录接口测试 - 第二版
使用封装好的公共方法，测试代码更简洁
"""
import json
import pytest
import allure
from common.read_yml import read_yml
from common.send_request import send_request
from common.assert_util import assert_status_code
from common.allure_util import attach_request_info, attach_response


# 读取测试用例数据
case_list = read_yml('./testcases/usermanage/get_token.yml')


@pytest.mark.parametrize('caseinfo', case_list)
def test_api_login(caseinfo):
    """
    登录接口参数化测试
    对比第一版，代码量减少了一半以上
    """
    # 设置用例标题和描述
    allure.dynamic.title(caseinfo["name"])
    allure.dynamic.description(caseinfo["description"])

    # 一行代码写入所有请求信息到报告
    attach_request_info(caseinfo)

    # 发送请求
    rep = send_request(caseinfo)

    # 一行代码写入响应信息到报告
    attach_response(rep)

    # 一行代码断言状态码
    assert_status_code(rep, caseinfo['expected']['status_code'])

    # 登录成功时打印token
    if rep.status_code == 200:
        token = rep.json()['data']['token']
        print(f'\n登录成功，Token: {token}')
