import {useState, useEffect} from 'react'
import axios from 'axios'
import CarCard from "../CarCard";
import CarInput from "../CarInput";
import styles from "./CarList.module.css"

interface CarInfoType{
    id: number;
    brand: string,
    model: string,
    year: number,
    code: string,
}

export default function CarList(){
    const [loading, setLoading] = useState(true)
    const [carData, setCarData] = useState<CarInfoType[] | null>(null)
    const [query, setQuery] = useState('')

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get<{ cars: CarInfoType[] }>('http://127.0.0.1:8000/api/list/')
                //const carsArray = Array.isArray(response.data) ? response.data : response.data.cars || response.data.items || [];
                setCarData(response.data.cars);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchCars();
    }, [carData]);

    const filteredCars = carData?.filter(carInfo =>
        carInfo.brand.toLowerCase().includes(query.toLowerCase()) ||
        carInfo.model.toLowerCase().includes(query.toLowerCase()) ||
        carInfo.code.toLowerCase().includes(query.toLowerCase()) ||
        carInfo.year.toString().includes(query))

    if(loading){
        return <div>Loading...</div>
    }
    if (!carData){
        return <div>No data available</div>
    }
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