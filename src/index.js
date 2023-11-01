// eslint-disable-next-line
import React from 'react';
import { render } from 'react-dom';
import reportWebVitals from './reportWebVitals';
import Header from "./components/Header";
import Todos from "./components/Todos";
import {ChakraProvider} from "@chakra-ui/react";


//ChakraProvider是使用chakra ui中其他组件的父组件，包含子组件（Header）为他们提供了一个主题
function App(){
    return (
        <ChakraProvider >
            <Header/>
            <Todos/> {/* new */}
        </ChakraProvider>
    )
}
const rootElement = document.getElementById('root')
render(
    <App />,
    rootElement
);
