"""
登录接口 - 参数化测试
使用 pytest.mark.parametrize 读取 yml 里的多组数据，自动跑多个用例
"""
import json
import pytest
import allure
from common.read_yml import read_yml
from common.send_request import send_request


# 读取 yml 文件，拿到测试用例列表
case_list = read_yml('./testcases/usermanage/get_token.yml')


@pytest.mark.parametrize('caseinfo', case_list)
def test_api_login(caseinfo):
    """
    登录接口测试
    每组 yml 数据会自动执行一次这个函数
    """
    # ========== 用例标题和描述 ==========
    allure.dynamic.title(caseinfo["name"])
    allure.dynamic.description(caseinfo["description"])

    # ========== 添加附件到Allure报告 ==========
    # 请求地址
    allure.attach(
        body=caseinfo['request']['url'],
        name="请求地址",
        attachment_type=allure.attachment_type.TEXT
    )
    # 请求方法
    allure.attach(
        body=caseinfo['request']['method'],
        name="请求方法",
        attachment_type=allure.attachment_type.TEXT
    )
    # 请求头
    allure.attach(
        body=json.dumps(caseinfo['request']['headers'], ensure_ascii=False, indent=2),
        name="请求头",
        attachment_type=allure.attachment_type.TEXT
    )
    # 请求数据
    allure.attach(
        body=json.dumps(caseinfo['request']['data'], ensure_ascii=False, indent=2),
        name="请求数据",
        attachment_type=allure.attachment_type.TEXT
    )

    # ========== 发送请求 ==========
    rep = send_request(caseinfo)

    # ========== 响应数据写入Allure报告 ==========
    allure.attach(
        body=rep.text,
        name="响应数据",
        attachment_type=allure.attachment_type.TEXT
    )

    # ========== 断言：验证状态码是否符合预期 ==========
    expected_status = caseinfo['expected']['status_code']
    assert rep.status_code == expected_status, \
        f"用例[{caseinfo['name']}]失败：期望状态码{expected_status}，实际{rep.status_code}"

    # ========== 如果登录成功，打印token ==========
    if rep.status_code == 200:
        token = rep.json()['data']['token']
        print(f'\n登录成功，Token: {token}')
