import {useState} from 'react'
import axios from 'axios'
import CarCard from "../CarCard";
import styles from "./CarList.module.css"
import {useQuery} from "@tanstack/react-query";



export default function CarList(){
    const [query, setQuery] = useState('')

    async function fetchCars(){
        const response = await axios.get('http://127.0.0.1:8000/api/list/')
        return response.data
    }

    const {data, isLoading, isError, error} = useQuery({
        queryKey:[`cars`],
        queryFn:fetchCars
    })
    if (isError){
        return <div>Ошибка: {error.message}</div>
    }
    if (isLoading){
        return <div>Данные загружаются...</div>
    }

    const filteredCars = data.cars?.filter(carInfo =>
        carInfo.brand.toLowerCase().includes(query.toLowerCase()) ||
        carInfo.model.toLowerCase().includes(query.toLowerCase()) ||
        carInfo.code.toLowerCase().includes(query.toLowerCase()) ||
        carInfo.year.toString().includes(query))
    return (
        <>
            <input className={styles.input} onChange={(e) => setQuery(e.target.value)} type="text" placeholder={"Поиск"}/>
            <div className={styles.container}>
                {filteredCars?.map(car => (
                    <CarCard id={car.id} key={car.id} brand={car.brand} model = {car.model} year = {car.year} code={car.code} />
                ))}
            </div>
        </>
    )
}