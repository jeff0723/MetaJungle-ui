import { Card, Typography } from "antd";
import React from 'react';
import bush from '../assets/images/bush.png';
import tree1 from '../assets/images/tree1.png';
import tree2 from '../assets/images/tree2.png';
import trunk from '../assets/images/trunk.png';
import { Orders } from '../constants/bushesOrder';
import Bush from './Bush';
import './Bushes.css';
const { Title } = Typography
interface Props {

}
const mapOrderToImage = (order: number) => {
    switch (order) {
        case 1:
            return tree1;
        case 2:
            return tree2;
        case 3:
            return trunk;
        case 4:
            return bush;
        default:
            return bush;
    }
}
const bushes: string[] = Orders.map(item => mapOrderToImage(item));
const styles = {
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
    },
}


const Bushes = (props: Props) => {

    return (
        <div>
            <Card style={{ ...styles.card, minWidth: '680px', width: '50vw', maxWidth: '875px' }} title={<Title>💰 Choose a Bush to Hide on</Title>}>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px', backgroundColor: '#423206ff', padding: '16px' }}>
                    {
                        bushes.map((item, key) => (
                            <Bush id={key} image={item} key={key} />
                        ))
                    }
                </div>
            </Card>


        </div>
    )
}

export default Bushes
