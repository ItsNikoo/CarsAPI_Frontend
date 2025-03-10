import styles from './CarInput.module.css'
import axios from "axios";
import {useMutation, useQueryClient} from "@tanstack/react-query";


export default function CarInput() {

    const queryClient = useQueryClient();


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


    function onSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        const car = {
            brand: formData.get("brand"),
            model: formData.get("model"),
            year: formData.get("year"),
            code: formData.get("code")
        }

        const errors: {[key: string]: string} = {};
        if (!car.brand.trim()) errors.brand = 'Марка не может быть пустой'
        if (!car.model.trim()) errors.model = "Модель не может быть пустой"
        if (!car.year || Number(car.year) <= 0) errors.year = "Год выпуска должен быть положительным числом"
        if (!car.code.trim()) {
            errors.code = 'Идентификатор не может быть пустым';
        } else if (car.code.length !== 10) {
            errors.code = 'Идентификатор должен быть длиной в 10 символов';
        }

        if (Object.keys(errors).length > 0) {
            alert(JSON.stringify(errors)); // Можно использовать состояние или отображение ошибок через UI
            return;
        }
        console.log(car)
        mutation.mutate(car)
        event.target.reset()

    }


    return (
        <>
            <form className={styles.container} onSubmit={onSubmit}>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Марка'
                           type="text"
                           name="brand"/>
                </div>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Модель'
                           type="text"
                           name="model"/>
                </div>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Год'
                           type="number"
                           name="year"/>
                </div>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Идентификатор'
                           type="text"
                           name="code"/>
                </div>
                <button type='submit'>Ввести данные</button>
            </form>
        </>
    )
}