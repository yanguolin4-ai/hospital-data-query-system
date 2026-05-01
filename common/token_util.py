"""
Token工具函数
封装登录获取Token的逻辑，供其他测试用例调用
"""
import requests

# 全局变量存储token，整个测试过程只登录一次
_token = None

# 服务器地址
BASE_URL = 'http://localhost:3000'


def get_token(username='admin', password='123456'):
    """
    登录获取Token
    第一次调用会请求接口，之后直接返回缓存的token

    参数:
        username: 用户名，默认admin
        password: 密码，默认123456

    返回:
        str: JWT Token字符串
    """
    global _token

    # 如果已经获取过token，直接返回（避免重复登录）
    if _token:
        return _token

    url = f'{BASE_URL}/api/auth/login'
    data = {'username': username, 'password': password}

    rep = requests.post(url=url, json=data)

    if rep.status_code == 200:
        _token = rep.json()['data']['token']
        return _token
    else:
        raise Exception(f'登录失败：{rep.text}')


def get_auth_headers():
    """
    获取带Token的请求头
    直接用于其他接口的请求

    返回:
        dict: 包含Authorization的请求头字典
    """
    token = get_token()
    return {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }


def clear_token():
    """
    清除缓存的Token
    需要重新登录时调用
    """
    global _token
    _token = None
