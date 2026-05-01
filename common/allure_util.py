"""
Allure报告工具函数
把常用的报告写入操作封装起来，一行代码搞定
"""
import json
import allure


def attach_request_info(caseinfo):
    """
    把请求信息写入Allure报告（地址、方法、请求头、请求数据）
    """
    allure.attach(
        body=caseinfo['request']['url'],
        name="请求地址",
        attachment_type=allure.attachment_type.TEXT
    )
    allure.attach(
        body=caseinfo['request']['method'].upper(),
        name="请求方法",
        attachment_type=allure.attachment_type.TEXT
    )
    allure.attach(
        body=json.dumps(caseinfo['request'].get('headers', {}), ensure_ascii=False, indent=2),
        name="请求头",
        attachment_type=allure.attachment_type.TEXT
    )
    allure.attach(
        body=json.dumps(caseinfo['request'].get('data', {}), ensure_ascii=False, indent=2),
        name="请求数据",
        attachment_type=allure.attachment_type.TEXT
    )


def attach_response(rep):
    """
    把响应信息写入Allure报告（状态码、响应体）
    """
    allure.attach(
        body=str(rep.status_code),
        name="响应状态码",
        attachment_type=allure.attachment_type.TEXT
    )
    allure.attach(
        body=rep.text,
        name="响应数据",
        attachment_type=allure.attachment_type.TEXT
    )
