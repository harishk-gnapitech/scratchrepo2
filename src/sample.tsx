import { useState } from "react";

export default function App(){
    const [count, setCount] = useState(0);
    console.log(count);
    setCount((c)=>c+2)
}