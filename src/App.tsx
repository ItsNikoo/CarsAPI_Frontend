import './App.css'
import CarList from "./Components/CarList";
import CarInput from "./Components/CarInput";
import {Routes, Route} from "react-router";

function App() {

    return (
        <>
            <Routes>
                <Route path="/input" element={<CarInput />}/>
                <Route index element={<CarList />}></Route>
            </Routes>
        </>
    )
}

export default App
