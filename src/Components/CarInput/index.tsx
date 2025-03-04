import styles from './CarInput.module.css'
import {useState} from "react";
import axios from "axios";


export default function CarInput() {
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [year, setYear] = useState(0)
    const [code, setCode] = useState<string>('')

    const [errors, setErrors] = useState<{
        brand?: string;
        model?: string;
        year?: string;
        code?: string;
    }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!brand) {
            newErrors.brand = 'Марка не может быть пустой';
        }
        if (!model) newErrors.model = 'Модель не может быть пустой';
        if (year <= 0) newErrors.year = 'Год выпуска должен быть положительным числом';
        if (!code) {
            newErrors.code = 'Идентификатор не может быть пустым';
        } else if (code.length !== 10) {
            newErrors.code = 'Идентификатор должен быть длиной в 10 символов';
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0; // Возвращает true, если ошибок нет

    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const carData = {
            brand,
            model,
            year,
            code
        }

        try{
            const response = await axios.post('http://127.0.0.1:8000/api/cars/', carData);
            console.log('Данные успешно отправлены:', response.data);

            // Очистка формы после успешной отправки
            setBrand('');
            setModel('');
            setYear(0);
            setCode('');
            setErrors({});
        }catch (error){
            console.log(error);

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Ошибка от сервера (например, 400 или 500)
                    console.error('Ошибка сервера:', error.response.data);
                } else {
                    // Ошибка сети или другая ошибка
                    console.error('Ошибка сети:', error.message);
                }
            }

        }

    }


    return (
        <>
            <form className={styles.container} onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Марка'
                           type="text"
                           value={brand}
                           onChange={(e) => setBrand(e.target.value)}/>
                    {errors.brand && <span className={styles.error}>{errors.brand}</span>}
                </div>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Модель'
                           type="text"
                           value={model}
                           onChange={(e) => setModel(e.target.value)}/>
                    {errors.model && <span className={styles.error}>{errors.model}</span>}
                </div>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        placeholder='Год выпуска'
                        type="number"
                        value={year === 0 ? '' : year} // Показываем пустую строку, если year === null
                        onChange={(e) => {
                            const value = e.target.value;
                            setYear(value === '' ? 0 : Number(value));
                        }}
                    />
                    {errors.year && <span className={styles.error}>{errors.year}</span>}
                </div>
                <div className={styles.inputContainer}>
                    <input className={styles.input}
                           placeholder='Идентификатор'
                           type="text"
                           value={code}
                           onChange={(e) => setCode(e.target.value)}/>
                    {errors.code && <span className={styles.error}>{errors.code}</span>}
                </div>
                <button onClick={handleSubmit} type='submit'>Ввести данные</button>
            </form>
        </>
    )
}