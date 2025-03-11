import styles from './CarInput.module.css'
import axios from "axios";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";


export default function CarInput() {

    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: '',
        code: ""
    })


    async function createCar(newCar) {
        const response = await axios.post(`http://127.0.0.1:8000/api/cars/`, newCar, {
            headers: {"Content-Type": "application/json"}
        });
        return response.data;
    }

    const mutation = useMutation({
        mutationFn: createCar,
        onSuccess: () => {
            queryClient.invalidateQueries([`cars`])
        },
        onError: (err) => {
            console.error(err)
        }
    })

    function handleChange(event) {
        const {name, value} = event.target;
        setFormData((prev) => ({...prev, [name]: value}))
    }


    function onSubmit(event) {
        event.preventDefault()
        const car = {
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            code: formData.code
        }

        const errors: { [key: string]: string } = {};
        if (!car.brand.trim()) errors.brand = 'Марка не может быть пустой'
        if (!car.model.trim()) errors.model = "Модель не может быть пустой"
        const yearNum = Number(car.year)
        if (!car.year || yearNum <= 0) errors.year = "Год выпуска должен быть положительным числом"
        if (!car.code.trim()) {
            errors.code = 'Идентификатор не может быть пустым';
        } else if (car.code.length !== 10) {
            errors.code = 'Идентификатор должен быть длиной в 10 символов';
        }

        if (Object.keys(errors).length > 0) {
            alert(JSON.stringify(errors)); // Можно использовать состояние или отображение ошибок через UI
            return;
        }
        const carToSend = { ...car, year: yearNum };
        console.log(carToSend)
        mutation.mutate(carToSend)
        setFormData({brand: '', model: '', year: '', code: ''})

    }


    return (
        <>
            <form className={styles.container} onSubmit={onSubmit}>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Марка'
                           type="text"
                           name="brand"
                           value={formData.brand}
                           onChange={handleChange}/>
                </div>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Модель'
                           type="text"
                           name="model"
                           value={formData.model}
                           onChange={handleChange}/>
                </div>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Год'
                           type="number"
                           name="year"
                           value={formData.year}
                           onChange={handleChange}/>
                </div>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Идентификатор'
                           type="text"
                           name="code"
                           value={formData.code}
                           onChange={handleChange}/>
                </div>
                <button type='submit'>Ввести данные</button>
            </form>
        </>
    )
}