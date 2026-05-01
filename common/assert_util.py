"""
断言工具函数
统一封装各种断言方式，测试代码更简洁，失败时报错信息更清晰
"""
import json


def assert_status_code(rep, expected_code):
    """
    断言响应状态码

    参数:
        rep: requests的响应对象
        expected_code: 期望的状态码，如 200、401
    """
    actual = rep.status_code
    assert actual == expected_code, \
        f"状态码断言失败：期望 {expected_code}，实际 {actual}，响应内容：{rep.text}"


def assert_json_value(rep, key, expected_value):
    """
    断言响应JSON中某个字段的值

    参数:
        rep: requests的响应对象
        key: 要检查的字段名，如 "code"、"message"
        expected_value: 期望的值
    """
    data = rep.json()
    actual = data.get(key)
    assert actual == expected_value, \
        f"字段[{key}]断言失败：期望 {expected_value}，实际 {actual}"


def assert_json_contains(rep, key):
    """
    断言响应JSON中包含某个字段

    参数:
        rep: requests的响应对象
        key: 要检查是否存在字段名
    """
    data = rep.json()
    assert key in data, \
        f"字段断言失败：响应中不包含字段 [{key}]，响应内容：{json.dumps(data, ensure_ascii=False)}"


def assert_response_success(rep, expected_code=200):
    """
    一步断言：状态码正确 + 响应JSON中code字段正确

    参数:
        rep: requests的响应对象
        expected_code: 期望的状态码，默认200
    """
    # 断言HTTP状态码
    assert_status_code(rep, expected_code)
    # 断言响应体中的code字段
    assert_json_value(rep, 'code', expected_code)
