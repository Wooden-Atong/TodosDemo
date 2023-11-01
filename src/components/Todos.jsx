// eslint-disable-next-line
// useState钩子负责管理我们应用程序的本地状态，而useEffect钩子允许我们执行数据获取等操作
// 同时引用多个组件加{}
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure
} from "@chakra-ui/react";

//定义一个管理所有组件的东东。接受两个程序值（？
const TodosContext=React.createContext({
    todos:[],fetchTodos:() =>{}
})

//要在Todos组件之前
function TodoHelper({item, id, fetchTodos}) {
  return (
    <Box p={1} shadow="sm">
      <Flex justify="space-between">
        <Text mt={4} as="div">
          {item}
          <Flex align="end">
            <UpdateTodo item={item} id={id} fetchTodos={fetchTodos}/>
              <DeleteTodo id={id} fetchTodos={fetchTodos}/>
          </Flex>
        </Text>
      </Flex>
    </Box>
  )
}
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

function AddTodo(){
    const [item,setItem] =React.useState("")
    const {todos,fetchTodos}=React.useContext(TodosContext)

    const handleInput=event=>{
        setItem(event.target.value)
    }
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
    //    用fetchTodo来更新todos
    }

    return(
        <form onSubmit={handleSubmit}>
            <InputGroup>
            <Input
            pr="4.5rem"
            type="text"
        placeholder="Add a todo item"
        aria-label="Add a todo item"
        onChange={handleInput}
            />
                </InputGroup>
        </form>
    )
}

function UpdateTodo({item,id}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [todo, setTodo] = useState(item)
    const {fetchTodos} = React.useContext(TodosContext)

    const updateTodo = async () => {
        await fetch(`http://localhost:8001/todo/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({item: todo})
        })
        onClose()
        await fetchTodos()
    }
    return (
        <>
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
function DeleteTodo({id}) {
        const {fetchTodos} = React.useContext(TodosContext)
        const deleteTodo = async () => {
            //fetch里面用id要用``这个括起来
            await fetch(`http://localhost:8001/todo/${id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: {"id": id}
            })

        await fetchTodos()
    }

    return (
        <Button h="1.5rem" size="sm" onClick={deleteTodo}>Delete Todo</Button>
    )


}