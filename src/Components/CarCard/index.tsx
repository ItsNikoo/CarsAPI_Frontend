import axios from "axios";
import {useQueryClient} from "@tanstack/react-query";

interface Props {
    id: number,
    brand : string,
    model : string,
    year : number,
    code: string
}

import styles from './CarCard.module.css'
export default function CarCard(props: Props) {
    const client = useQueryClient();

    async function deleteCar(id: number) {
        try{
            const response = await axios.delete(`http://127.0.0.1:8000/api/cars/${id}/`);
            console.log(response)

            client.invalidateQueries([`cars`])
        }catch(error){
            console.log(error);
        }
        }

    return (
        <div className={styles.cardsContainer}>
            <div className={styles.nameAndWinContainer}>
                <h1 className={styles.text}>{props.brand} {props.model}</h1>
                <h1 className={styles.winText}>{props.code}</h1>
            </div>
            <div className={styles.yearAndDeleteContainer}>
                <h1 className={styles.text}>{props.year}</h1>
                <button onClick={() => deleteCar(props.id!)} className={styles.deleteButton}>delete</button>
            </div>
        </div>
    )
}