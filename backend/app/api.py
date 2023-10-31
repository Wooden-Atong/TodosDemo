# -*- coding = utf-8 -*-
# @Time : 3:53 下午
# @Author : 阿童木
# @File : api.py
# @software: PyCharm

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
todos = [
    {
        "id": "1",
        "item": "Read a book."
    },
    {
        "id": "2",
        "item": "Cycle around town."
    }
]

app=FastAPI()

origins=[
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

@app.get("/todo",tags=["todo"])
async def get_todos() -> dict:
    return {"data": todos}

@app.post("/todo",tags=["todo"])
async def add_todo(todo:dict)->dict:
    todos.append(todo)
    return {"data":{"Todo added."}}

@app.put("/todo/{id}",tags=["todos"])
async def update_todo(id:int,body:dict)->dict:
    for todo in todos:
        if int(todo["id"])==id:
            todo["item"]=body["item"]
            return {
                "data":f"Todo with id {id} has been updated."
            }

    return {
                "data":f"Todo with id {id} not found."
            }

@app.delete("/todo/{id}",tags=["todos"])
async def remove_todo(id:int)->dict:
    for todo in todos:
        if int(todo["id"])==id:
            todos.remove(todo)
            return {
                "data":f"Todo with if {id} has been removed."
            }
    return {
        "data":f"Todo with id {id} not found."
    }




# 当没有写前端测试POST请求的方法
# curl -X POST http://localhost:8001/todo -d '{"id": "3", "item": "Buy some testdriven courses."}' -H 'Content-Type: application/json'