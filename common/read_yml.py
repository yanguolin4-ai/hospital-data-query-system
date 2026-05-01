"""
读取 yml 测试用例文件的工具函数
yml 文件里每个 - 开头的块就是一组测试数据，会变成列表里的一个字典
"""
import yaml


def read_yml(file_path):
    """
    读取 yml 文件并返回测试数据列表

    参数:
        file_path: yml文件的路径

    返回:
        list: 测试用例列表，每个元素是一个字典
        例如: [{"name": "用例1", "request": {...}, "expected": {...}}, ...]
    """
    with open(file_path, encoding='utf-8') as f:
        data = yaml.safe_load(f)
    return data
