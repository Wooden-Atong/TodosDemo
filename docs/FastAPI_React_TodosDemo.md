# 1.整体构建思路

**前端：**前端从用户拿到数据，进行处理，接着请求后端。总之前端就是处理数据呈现形式，是用户和后端数据库中间的桥梁。

**后端：**根据前端发送请求的方法定义每一种处理函数，处理函数都是对数据进行操作，接着将要呈现给前端的数据return。

# 2.后端FastAPI构建

## 2.1 代码框架

```python
backend
	|__app
  	|__init__py
    |__api.py
  |__main.py #启动后端 
```

## 2.2 扩充知识

### 2.2.1 Uvicorn

**定义：**Uvicorn 是基于 uvloop 和 httptools 构建的非常快速的 ASGI 服务器。 uvicorn是一个基于asyncio开发的一个轻量级高效的web服务器框架。

**使用：**（一般在后端代码的main文件当中，如下）

```python
uvicorn.run("app.api:app",host='0.0.0.0',port=8001,reload=True)
```

### 2.2.2 CORSMiddleware

**定义：**跨域资源共享中间件。

**作用：**由于当前端和后端处于不同源（协议+域+端口），前端向后端发送请求，后端需要先发送适当的header来授权前端（不同源）的通信，这样浏览器才会允许前端跨源向后端通信。（具体使用见2.3.3）

### 2.2.3 GET POST PUT DELETE

**定义：**是几种HTTP协议当中常用的http请求方法。一般是前端发送请求的时候在method当中填的。

（API如何接受不同method发来的请求，详细见2.3.4）



## 2.3 后端实现逻辑

### 2.3.1 整体逻辑

从main中启动Uvicorn在本地服务器；接着app/api.py中 1）定义数据库 2）中间件的添加 3）启动Fastapi定义各种操作。

### 2.3.2 Dict数据库

由于只是小Demo，这里数据库是简单的列表嵌套字典，包含id和item两个字端，都是string类型。

### 2.3.3 中间件的添加

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(CORSMiddleware,
                   allow_origins=origins,#允许的其他源
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"], )
```

中间件嵌入到app当中，由于CORSMiddleware默认参数保守，所以后面显示定义了一些参数。

### 2.3.4 异步操作函数

**1）get方法 def get_todos()**

**基础定义：**get是直接拿已有资源返回。也就是前端没有东西请求过来，后端API直接拿数据返回。

**TodoDemo：**API直接拿已经存在的todos数据，返回在前端界面上。

**2）post方法 def add_todo()**

**基础定义：**post向服务器请求提交数据。也就是前端向后端请求提交表单，后端拿到数据写入数据库。

**TodoDemo：**前端拿到新的todo数据表单，请求发送到后端，后端拿到数据后写入todos所有数据。

**3）put方法 def update_todo()**

**基础定义：**put用来更新现有资源。也就是前端要提供需要更新覆盖的全部信息，后端接受然后更新数据库。

**TodoDemo：**客户端将要更新的item的id和body一起发送过来（也属于一种请求），然后API在Todos数据中搜索item_id，找到后覆盖写入body信息。

**4）delete方法 def remove_todo()**

**基础定义：**delete是用来请求服务器删除指定资源。

**ToDemo：**前端发送要删除的item的id，API进行在数据库当中的搜索然后进行删除。

# 3.前端React构建

## 3.1 代码构建

```python
frontend
	|__node_modules
  |__public
  |__src
  	|__components #自定义组件
    	|__Header.jsx
      |__Todo.jsx
    |__index.js #默认主界面，自定义组件渲染进这里
  |__package.json
  |__package-lock.json
```



## 3.2 扩充知识

### 3.2.1 React.createContext()

```react
//创建管理所有组件的东东（我的理解下面定义的相当于声明一个全局变量，所有组件都可以使用它并对它操作）
//todos是一个空列表，fetchTodos是一个函数
const TodosContext = React.createContext({
  todos: [], fetchTodos: () => {}
})
```

### 3.2.2 React.useContext()

```react
//上述创建好之后就可以在组件当中这样使用（对todos操作，使用fetchTodos，如果只使用todos也可以只引进来todos）
const {todos, fetchTodos} = React.useContext(TodosContext)
```

### 3.2.3 useState()

```react
// item是“”，setItem是一个方法
// 示例1：就是假如说我调用 setItem(new) 就相当于触发重新渲染，把item值更新为new
const [item,setItem] =React.useState("") 
// 示例2: 就是说假如我调用 setOn(true) 就相当于更新on从false到true
const [on,setOn] =React.useState(false)
```

### 3.2.4 useEffect()

允许我们执行数据获取等操作（？

### 3.2.5 useDisclosure()

⚠️注意是chakra-ui下的，而不是从react中引入。

```react
//只看本项目中使用的话 isOpen、onOpen、onClose
import {useDisclosure} from "@chakra-ui/react";
// 如果调用onOpen，isOpen为true；如果调用onClose，isOpen为false。
const {isOpen, onOpen, onClose} = useDisclosure()

```



### 3.2.6 基本组件

**定义：**一个jsx文件有且只能有一个基本组件，可以理解为这个jsx文件的主函数，其他组件都是这个基本组件的自组件。

**实现：**

```react
# 方式一 ：直接定义
export default function Todos(){...}
# 方式二 ：在最后导出 
export default Header
```

## 3.3 前端逻辑实现

### 3.3.1 整体逻辑

主界面从index.js进入，在自定义下的components下面定义功能组件 1）Header.jsx和 2）Todos.jsx,接着将这两个自定义组件渲染到index.js当中。

### 3.3.2 Header.jsx

功能：定义头部组件，无实际功能，仅仅是一个头部装饰。

### 3.3.3 Todos.jsx

**1）default function Todos()**

```react
//基本组件
export default function Todos(){
    const [todos,setTodos] = useState([])
    //检索数据
    const fetchTodos = async () =>{
        //从后端获取数据
        //一直报不能安全连接，竟然是要http。。。网络知识欠缺
        const response = await fetch("http://0.0.0.0:8001/todo")

        const todos = await response.json()
        setTodos(todos.data)
    }
    useEffect(()=>{
        //调用fetchTodos
        fetchTodos()
    },[])

    return (
        <TodosContext.Provider value={{todos,fetchTodos}}>
            <AddTodo/>
            <Stack spacing={5}>
                {todos.map((todo)=>(
                    <TodoHelper item={todo.item} id={todo.id} fetchTodos={fetchTodos}/>
                ))}
            </Stack>
        </TodosContext.Provider>
    )
}
```

**2）function AddTodo()**

代码逻辑（learn）：

```react
function AddTodo(){
  //先定义一个item状态变量和状态更新函数setItem（使用useState方法）；
    const [item,setItem] =React.useState("")
    //接着定义todos和fetchTodos方法
    const {todos,fetchTodos}=React.useContext(TodosContext)
		
    //定义处理输入的操作：调用setItem函数更新item为当下event的值
    const handleInput=event=>{
        setItem(event.target.value)
    }
    //定义处理提交操作：
    	//先定义要发送数据newTodo，
    	//接着用fetch发送请求到后端，
    	//然后调用fetchTodos函数再拿到后端数据库更新后的Todos更新前端todos
    const handleSubmit=(event)=>{
        const newTodo={
            "id":todos.length+1,
            "item":item
        }
        fetch("http://localhost:8001/todo",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(newTodo)
        }).then(fetchTodos)
    }

    return(
      //表单form 调用handleSubmit函数
        <form onSubmit={handleSubmit}>
            <InputGroup>
            <Input
            pr="4.5rem"
            type="text"
        placeholder="Add a todo item"
        aria-label="Add a todo item"
       //一旦点击提交调用handleInput，才会更新item并真正调用handleSubmit中的fetch操作
        onChange={handleInput}
            />
                </InputGroup>
        </form>
    )
}
```

**3）function updateTodo()**

```react
function UpdateTodo({item,id}) {
  //是否开着、打开、关闭
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [todo, setTodo] = useState(item)
    const {fetchTodos} = React.useContext(TodosContext)
	 //组件主要操作
    const updateTodo = async () => {
        await fetch(`http://localhost:8001/todo/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({item: todo})
        })
      //关闭
        onClose()
      //后端是更新了但要调用fetchTodos（）才能更新前端刷新显示
        await fetchTodos()
    }
    return (
        <> //打开
            <Button h="1.5rem" size="sm" onClick={onOpen}>Update Todo</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Update Todo</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <InputGroup size="md">
                            <Input
                                pr="4.5rem"
                                type="text"
                                placeholder="Add a todo item"
                                aria-label="Add a todo item"
                                value={todo}
                                onChange={e => setTodo(e.target.value)}
                            />
                        </InputGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button h="1.5rem" size="sm" onClick={updateTodo}>Update Todo</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
```

**4）function DeleteTodo()**

略 类似updateTodo

### 