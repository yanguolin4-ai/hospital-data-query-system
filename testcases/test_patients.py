"""
患者接口测试
演示Token依赖：先登录拿Token，再用Token访问患者接口
"""
import json
import pytest
import allure
from common.read_yml import read_yml
from common.send_request import send_request
from common.assert_util import assert_status_code, assert_json_contains
from common.allure_util import attach_request_info, attach_response
from common.token_util import get_auth_headers


# 读取患者接口测试用例
case_list = read_yml('./testcases/usermanage/patients.yml')


@pytest.mark.parametrize('caseinfo', case_list)
def test_patients_api(caseinfo):
    """
    患者接口参数化测试
    自动带上Token，不需要每个用例单独登录
    """
    allure.dynamic.title(caseinfo["name"])
    allure.dynamic.description(caseinfo["description"])

    # 自动获取带Token的请求头，覆盖yml里的空headers
    auth_headers = get_auth_headers()
    caseinfo['request']['headers'] = auth_headers

    # 写入请求信息到报告
    attach_request_info(caseinfo)

    # 发送请求
    rep = send_request(caseinfo)

    # 写入响应信息到报告
    attach_response(rep)

    # 断言状态码
    assert_status_code(rep, caseinfo['expected']['status_code'])

    # 如果是查询成功，验证响应体结构
    if rep.status_code == 200:
        # 验证响应体包含 data 字段
        assert_json_contains(rep, 'data')
        print(f'\n查询成功：{caseinfo["name"]}')
