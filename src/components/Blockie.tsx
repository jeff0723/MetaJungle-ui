import React from 'react'
import Blockies from "react-blockies";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import './Blockie.css'
interface Props {

}

const Blockie = (props: Props) => {
    const { walletAddress } = useMoralisDapp();
    if (!walletAddress) return null;
    return (
        <Blockies
            seed={walletAddress.toLowerCase()}
            className="identicon"
            scale={3}
        />
    );
}

export default Blockie
