# -*- coding = utf-8 -*-
# @Time : 3:50 下午
# @Author : 阿童木
# @File : main.py
# @software: PyCharm

import uvicorn

if __name__=='__main__':
    uvicorn.run("app.api:app",host='0.0.0.0',port=8001,reload=True)