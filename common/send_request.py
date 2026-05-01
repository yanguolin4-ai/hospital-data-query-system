"""
发送HTTP请求的工具函数
统一处理 GET 和 POST 请求，减少测试代码重复
"""
import requests


def send_request(caseinfo):
    """
    根据用例数据发送对应的HTTP请求

    参数:
        caseinfo: 单条测试用例的字典，包含 request 和 expected 字段

    返回:
        Response: requests库的响应对象，包含status_code、text、json()等
    """
    url = caseinfo['request']['url']
    method = caseinfo['request']['method']
    headers = caseinfo['request'].get('headers', {})
    data = caseinfo['request'].get('data', {})

    if method == 'post':
        # json= 传入字典，requests会自动序列化为JSON字符串
        rep = requests.post(url=url, json=data, headers=headers)
    elif method == 'get':
        rep = requests.get(url=url, params=data, headers=headers)
    else:
        raise ValueError(f'不支持的请求方法: {method}')

    return rep
